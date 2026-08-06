//package com.funkofabs.config;
//
//import com.funkofabs.entity.Product;
//import com.funkofabs.entity.User;
//import com.funkofabs.repository.ProductRepository;
//import com.funkofabs.repository.UserRepository;
//import lombok.RequiredArgsConstructor;
//import org.springframework.boot.CommandLineRunner;
//import org.springframework.security.crypto.password.PasswordEncoder;
//import org.springframework.stereotype.Component;
//
//import java.math.BigDecimal;
//
//@Component
//@RequiredArgsConstructor
//public class DataLoader implements CommandLineRunner {
//
//    private final ProductRepository productRepository;
//    private final UserRepository userRepository;
//    private final PasswordEncoder passwordEncoder;
//
//    @Override
//    public void run(String... args) {
//        if (productRepository.count() == 0) {
//            // Admin user
//            userRepository.save(User.builder()
//                    .name("Admin FunkoFabs")
//                    .email("admin@funkofabs.com")
//                    .password(passwordEncoder.encode("admin123"))
//                    .role(User.Role.ADMIN)
//                    .build());
//
//            // Products
//            productRepository.save(Product.builder()
//                    .name("Capitão Fabs da Pátria")
//                    .description("Não é só um boneco. É uma declaração. Edição limitada do herói nacional.")
//                    .price(new BigDecimal("149.90"))
//                    .imageUrl("assets/FunkoFabs/FunkoFabs (1).png")
//                    .stock(15).category("exclusivo").build());
//
//            productRepository.save(Product.builder()
//                    .name("Rainbow Unicorn Rider")
//                    .description("Edição ultradeluxe. Fabs montado em um pegacórnio alado em tons pastel.")
//                    .price(new BigDecimal("299.90"))
//                    .imageUrl("assets/FunkoFabs/FunkoFabs (2).png")
//                    .stock(5).category("ultradeluxe").build());
//
//            productRepository.save(Product.builder()
//                    .name("Fabs Ninja Stealth")
//                    .description("Versão ninja com katana e máscara. Perfeito pra quem curte ação.")
//                    .price(new BigDecimal("89.90"))
//                    .imageUrl("assets/FunkoFabs/FunkoFabs (3).png")
//                    .stock(30).category("classico").build());
//
//            productRepository.save(Product.builder()
//                    .name("Fabs Astronauta")
//                    .description("Explorando galáxias com estilo. Capacete removível e bandeira customizada.")
//                    .price(new BigDecimal("119.90"))
//                    .imageUrl("assets/FunkoFabs/FunkoFabs (4).png")
//                    .stock(20).category("classico").build());
//
//            productRepository.save(Product.builder()
//                    .name("Fabs Rockstar")
//                    .description("Guitarra elétrica, óculos escuros e atitude. Born to rock.")
//                    .price(new BigDecimal("99.90"))
//                    .imageUrl("assets/FunkoFabs/FunkoFabs (5).png")
//                    .stock(25).category("classico").build());
//
//            productRepository.save(Product.builder()
//                    .name("Fabs Wizard Supreme")
//                    .description("Manto místico, cajado com cristal e poderes infinitos. Edição especial.")
//                    .price(new BigDecimal("179.90"))
//                    .imageUrl("assets/FunkoFabs/FunkoFabs (6).png")
//                    .stock(10).category("exclusivo").build());
//
//            System.out.println(">>> Dados iniciais carregados: 1 admin + 6 produtos");
//        }
//    }
//}
