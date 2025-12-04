@Repository
public interface SwipeRepository extends JpaRepository<Swipe, Long> {

    @Query("""
        SELECT s.targetPet.id
        FROM Swipe s
        WHERE s.user.id = :userId
    """)
    Set<Long> findAllSwipedPetIdsByUser(Long userId);
}
