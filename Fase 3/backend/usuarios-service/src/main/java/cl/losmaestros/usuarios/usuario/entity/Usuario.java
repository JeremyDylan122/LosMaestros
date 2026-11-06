package cl.losmaestros.usuarios.usuario.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "usuarios")
public class Usuario {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public Long id;

    @Column(nullable = false, unique = true, length = 10)
    public String run;
    @Column(nullable = false, length = 50)
    public String nombre;
    @Column(nullable = false, length = 100)
    public String apellidos;
    @Column(nullable = false, unique = true, length = 100)
    public String email;
    @Column(nullable = false, length = 60)
    public String passwordHash;
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    public Rol rol;
    @Column(nullable = false)
    public boolean activo = true;
    @Column(length = 100)
    public String region;
    @Column(length = 100)
    public String comuna;
    @Column(length = 300)
    public String direccion;
    @Column(length = 150)
    public String empresa;
}
