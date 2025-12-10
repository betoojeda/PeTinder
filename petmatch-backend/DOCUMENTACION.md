# Documentación Técnica Detallada del Backend - PetMatch

Este documento es una guía de estudio para entender la arquitectura, las decisiones de diseño y los conceptos clave implementados en el backend de PetMatch.

### Cómo Leer Este Documento

La mejor forma de usar esta guía es tener el código abierto al lado. Lee una sección y luego busca las clases y métodos mencionados en el proyecto para ver la teoría en acción.

---

## 1. Arquitectura y Filosofía de Diseño

El backend está diseñado siguiendo principios modernos de desarrollo de software para ser **seguro, mantenible y escalable**.

- **Arquitectura en Capas (Layered Architecture):** El código está organizado en capas lógicas, cada una con una responsabilidad única. Esto se conoce como **Separación de Conceptos (Separation of Concerns)**.
  - **Capa de Controlador (`controller`):** Su única responsabilidad es manejar las peticiones HTTP (GET, POST, etc.), validar los datos de entrada básicos y devolver una respuesta HTTP. No contiene lógica de negocio.
  - **Capa de Servicio (`service`):** Aquí vive la "lógica de negocio". Coordina las acciones, realiza cálculos y decide qué repositorios llamar.
  - **Capa de Repositorio (`repository`):** Su única responsabilidad es comunicarse con la base de datos.
  
  *¿Por qué?* Esta separación hace que el código sea increíblemente más fácil de leer, depurar y probar. Si hay un error en la lógica de negocio, sabes que debes buscar en la capa de `service`, no en el `controller`.

- **Inyección de Dependencias (Dependency Injection - DI):** En lugar de que una clase cree sus propias dependencias (ej. `AuthService` creando un `new UserRepository()`), el framework (Spring) se encarga de crear y "inyectar" estas dependencias automáticamente.
  
  *¿Por qué?* Esto desacopla los componentes. Facilita las pruebas (puedes inyectar un "repositorio falso" para probar un servicio) y hace que el código sea más flexible. Usamos la **inyección por constructor** con la anotación `@RequiredArgsConstructor` de Lombok, que es la forma recomendada por ser más segura y explícita.

- **Configuración Externalizada:** Las configuraciones sensibles (contraseñas de BD, claves de API) no están en el código. Se definen en el archivo `application.yaml` usando placeholders (ej. `${JWT_SECRET}`) que se rellenan con **Variables de Entorno**.
  
  *¿Por qué?* Por **seguridad y portabilidad**. Permite ejecutar el mismo código en diferentes entornos (desarrollo local, producción en Railway) simplemente cambiando las variables de entorno, sin modificar nunca el código fuente.

---

## 2. Flujos de Trabajo Detallados

### 2.1. Flujo de Autenticación Segura (El Corazón de la App)

Este es el flujo más crítico. Lo diseñamos para ser seguro contra ataques comunes como XSS.

1.  **Petición (`POST /api/auth/login`):** El usuario envía su correo y contraseña.
2.  **Autenticación (`AuthenticationManager`):** `AuthService` delega la validación a `AuthenticationManager` de Spring Security. Este a su vez usa nuestro `JwtUserDetailsService` para cargar el usuario de la BD y comparar las contraseñas (la enviada por el usuario y la hasheada en la BD). Si no coinciden, lanza una `BadCredentialsException`.
3.  **Manejo de Error de Credenciales:** Nuestra clase `GlobalExceptionHandler` tiene un método específico para `BadCredentialsException`. Atrapa este error y devuelve una respuesta `401 Unauthorized` con un mensaje genérico ("Credenciales incorrectas"), evitando la enumeración de usuarios.
4.  **Generación de Token JWT (`JwtUtil`):** Si la autenticación es exitosa, `JwtUtil` crea un token JWT. Este token es una cadena de texto firmada digitalmente que contiene información del usuario (como su email y rol). La firma asegura que el token no pueda ser modificado por un atacante.
5.  **Establecimiento de Cookie `HttpOnly`:** Aquí está la clave de la seguridad. En lugar de devolver el token en el cuerpo de la respuesta (donde JavaScript podría acceder a él), `AuthController` lo empaqueta en una cookie con la bandera `HttpOnly`.
    - *¿Qué significa `HttpOnly`?* Es una instrucción para el navegador que dice: "Esta cookie solo puede ser enviada y recibida por el servidor en peticiones HTTP. Ningún script que se ejecute en la página (ni siquiera tu propio JavaScript) puede leerla". Esto anula por completo los ataques de robo de tokens por XSS.
6.  **Filtro en Peticiones Posteriores (`JwtRequestFilter`):** Para cualquier otra petición a un endpoint protegido (ej. `GET /api/feed`), el navegador adjunta automáticamente la cookie `HttpOnly`. Nuestro filtro `JwtRequestFilter` se ejecuta primero, extrae el token de la cookie, lo valida con `JwtUtil`, y si es válido, establece el contexto de seguridad de Spring. Solo entonces la petición puede continuar hacia el controlador.

### 2.2. Flujo de Subida de Imágenes (Separación de Responsabilidades)

Decidimos no guardar las imágenes en la base de datos, ya que es ineficiente y costoso.

1.  **Endpoint (`POST /api/pets/{petId}/photos`):** El controlador recibe el archivo como un `MultipartFile`. Su única tarea es validar la entrada y llamar al servicio.
2.  **Lógica de Servicio (`PetService`):** Llama a `CloudinaryService` para subir el archivo.
3.  **Servicio Externo (`CloudinaryService`):** Esta clase contiene toda la lógica para hablar con la API de Cloudinary. Si en el futuro quisiéramos cambiar a otro proveedor (como AWS S3), solo tendríamos que modificar esta clase, sin tocar el resto de la aplicación.
4.  **Actualización de la BD:** Una vez que Cloudinary devuelve la URL pública de la imagen, `PetService` la añade a la lista `photoUrls` de la entidad `Pet` y la guarda en la base de datos a través de `PetRepository`.

---

## 3. Glosario de Anotaciones y Conceptos Clave

- **`@RestController`**: Le dice a Spring: "Esta clase es un controlador web, y sus métodos devolverán datos en formato JSON directamente en el cuerpo de la respuesta".

- **`@Service`**: Es una anotación semántica. Le dice a otros desarrolladores (y a Spring): "Esta clase contiene la lógica de negocio principal".

- **`@Repository`**: Le dice a Spring: "Esta interfaz es responsable del acceso a datos". Spring Data JPA la usará para generar automáticamente los métodos para hablar con la base de datos.

- **`@Entity`**: Le dice a JPA/Hibernate: "Esta clase Java representa una tabla en la base de datos. Cada campo de la clase es una columna".

- **`@ElementCollection`**: Una forma sencilla y potente de JPA para mapear una colección de tipos básicos (como una `List<String>`) a una tabla separada. La usamos para la galería de fotos de las mascotas, evitando la complejidad de crear una entidad `Photo` separada.

- **`@RestControllerAdvice`**: Una anotación muy poderosa. Crea un "guardián" global que vigila toda la aplicación. Si cualquier controlador lanza una excepción que no es atrapada, este guardián la intercepta.

- **`@ExceptionHandler(Exception.class)`**: Dentro del `@RestControllerAdvice`, este método actúa como un "plan de contingencia". Le dices: "Si atrapas una `Exception` (o cualquier subtipo, como `BadCredentialsException`), ejecuta este método para devolver una respuesta de error bonita y controlada en lugar de un stack trace feo y revelador".

- **`@PreAuthorize("hasRole('ADMIN')")`**: Es un portero de seguridad a nivel de método. Antes de que se ejecute el método, Spring Security comprueba si el usuario autenticado tiene el rol 'ADMIN'. Si no, deniega el acceso inmediatamente con un error `403 Forbidden`.

- **`ddl-auto: update`**: Una configuración de desarrollo muy útil. `ddl` significa "Data Definition Language" (lenguaje de definición de datos, como `CREATE TABLE`). `update` le dice a Hibernate que modifique la base de datos para que coincida con tus clases `@Entity` al arrancar. **Precaución:** Es genial para desarrollo, pero arriesgado en producción con datos reales.

- **Inyección de Dependencias por Constructor**: Es el patrón que usamos con `@RequiredArgsConstructor`. En lugar de anotar cada campo con `@Autowired`, declaramos los campos como `final` y Lombok crea un constructor que los recibe. Spring usa ese constructor para inyectar las dependencias. Se considera más seguro porque garantiza que el objeto no se pueda crear sin sus dependencias necesarias.
