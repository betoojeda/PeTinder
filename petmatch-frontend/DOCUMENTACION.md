# Documentación Técnica Detallada del Frontend - PetMatch

Este documento es una guía de estudio para entender la arquitectura, las decisiones de diseño y los conceptos clave implementados en el frontend de PetMatch.

### Cómo Leer Este Documento

La mejor forma de usar esta guía es tener el código abierto al lado. Lee una sección y luego busca los componentes y hooks mencionados en el proyecto para ver la teoría en acción.

---

## 1. Arquitectura y Filosofía de Diseño

El frontend está construido con React siguiendo principios modernos para crear una **Single Page Application (SPA)** rápida, interactiva y fácil de mantener.

- **Arquitectura Basada en Componentes:** La interfaz se divide en pequeños bloques reutilizables llamados **componentes** (ej. `PetForm`, `ChatWindow`). Cada componente tiene su propia lógica y vista, lo que hace que el desarrollo sea modular y escalable.

- **Estado Declarativo:** En lugar de decirle a la aplicación *cómo* cambiar la interfaz paso a paso (enfoque imperativo), en React simplemente declaramos *cómo* debería ser la interfaz para un estado determinado (enfoque declarativo). Cuando el estado cambia (ej. `isLoading` se vuelve `true`), React se encarga de actualizar la interfaz eficientemente para que coincida con el nuevo estado.

- **Flujo de Datos Unidireccional (One-Way Data Flow):** Los datos fluyen en una sola dirección: desde los componentes padres hacia los componentes hijos a través de **props**. Si un componente hijo necesita cambiar un dato del padre, lo hace llamando a una función que el padre le ha pasado como prop.
  
  *¿Por qué?* Esto hace que el flujo de datos sea predecible y mucho más fácil de depurar. Sabes exactamente de dónde vienen los datos y qué los está cambiando.

- **Separación de Lógica y Vista:**
  - **Componentes:** Se encargan de la lógica (manejar el estado, las interacciones del usuario) y de renderizar la estructura.
  - **CSS:** Se encarga exclusivamente de la apariencia visual. Hemos optado por archivos CSS dedicados por página/componente para mantener los estilos encapsulados y evitar conflictos.

---

## 2. Flujos de Trabajo Detallados

### 2.1. Flujo de Autenticación y Estado Global (`AuthContext`)

Este es el sistema nervioso central de la aplicación.

1.  **El Proveedor (`AuthProvider`):** En `App.jsx`, toda la aplicación está envuelta en `<AuthProvider>`. Esto crea un "Contexto" que contendrá el estado de autenticación (quién es el usuario, si está logueado, etc.).
2.  **El Hook (`useAuth`):** Cualquier componente que necesite saber si el usuario está logueado o necesite llamar a la función `login`, simplemente usa el hook `useAuth()`. Esto le da acceso instantáneo al estado global sin necesidad de pasar props.
3.  **Restauración de Sesión (`useEffect` en `AuthContext`):** Cuando la aplicación se carga por primera vez, el `useEffect` en `AuthContext` hace una llamada a `/api/auth/me`. Como el navegador envía la cookie `HttpOnly` automáticamente, si la sesión es válida, el backend devuelve los datos del usuario. El `AuthContext` guarda estos datos, y el usuario es "mágicamente" logueado sin tener que hacer nada.
4.  **Rutas Protegidas (`ProtectedRoute`):** Este componente usa `useAuth()` para obtener el estado `isAuthenticated`. Si es `false`, redirige a la página de inicio. Si es `true`, permite el acceso a la ruta solicitada.

### 2.2. Flujo de Renderizado Condicional (Manejo de Carga y Errores)

Un buen componente que carga datos sigue este patrón:

```jsx
const [data, setData] = useState([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);

useEffect(() => {
  const fetchData = async () => {
    try {
      setLoading(true); // 1. Inicia la carga
      const result = await miLlamadaApi();
      setData(result); // 4. Si hay éxito, guarda los datos
    } catch (err) {
      setError(err.message); // 5. Si hay error, guarda el mensaje
      toast.error(err.message);
    } finally {
      setLoading(false); // 6. En cualquier caso, termina la carga
    }
  };
  fetchData();
}, []);

if (loading) return <LoadingSpinner />; // 2. Mientras carga, muestra un spinner
if (error) return <ErrorMessage message={error} />; // 3. Si hay error, muestra un mensaje de error

return <MiComponenteConDatos data={data} />; // 7. Si todo fue bien, muestra los datos
```

Este patrón asegura que el usuario siempre vea un estado de la interfaz coherente y nunca una pantalla en blanco o rota.

---

## 3. Glosario de Hooks y Conceptos Clave de React

- **`useState(initialValue)`**: El hook fundamental para añadir estado a un componente. Devuelve un array con dos elementos: el valor actual del estado y una función para actualizarlo. `const [count, setCount] = useState(0);`

- **`useEffect(callback, [dependencies])`**: El hook para los "efectos secundarios".
  - `callback`: La función que se ejecutará.
  - `[dependencies]`: Un array de variables. El `useEffect` se volverá a ejecutar **solo si** alguna de estas variables cambia. Si el array está vacío (`[]`), el efecto se ejecuta solo una vez.

- **`useContext(MyContext)`**: El hook que permite "leer" y suscribirse a un contexto. Es la forma moderna de evitar el "prop drilling" (pasar props a través de muchos niveles de componentes).

- **`React.lazy(importFunction)`**: Una función que te permite renderizar un componente importado dinámicamente. El `import('./MiComponente')` no se ejecuta hasta que el componente se intenta renderizar por primera vez.

- **`<Suspense fallback={<Spinner />}>`**: Un componente que se usa con `React.lazy`. Muestra el `fallback` (ej. un spinner) mientras el componente "perezoso" se está descargando.

- **Renderizado Condicional:** Es la técnica de usar operadores de JavaScript (como `&&` o el ternario `condicion ? <A /> : <B />`) dentro del JSX para decidir qué mostrar en la interfaz basándose en el estado actual.
  - `isLoading && <LoadingModal />`: "Si `isLoading` es verdadero, entonces renderiza el `LoadingModal`".

- **Keys en Listas (`key={item.id}`):** Cuando renderizas una lista de elementos con `.map()`, React necesita una prop `key` única para cada elemento. Esto le ayuda a identificar qué elementos han cambiado, se han añadido o eliminado, optimizando el rendimiento de las actualizaciones de la lista.
