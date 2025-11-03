// Comprehensive translation system for Quantum Gaze
const translations = {
    en: {
        // Navigation
        nav: {
            home: 'Home',
            services: 'Services',
            solutions: 'Solutions',
            industries: 'Markets',
            about: 'About',
            contact: 'Contact'
        },

        // Homepage
        home: {
            hero_badge: 'Quebec-Based • Multilingual Excellence • 35+ Years Experience',
            hero_title: 'AI-Powered Solutions & Legacy Modernization',
            hero_subtitle: '35+ years of software engineering expertise meets cutting-edge AI. We help government and enterprise organizations in Canada and internationally modernize legacy systems, automate with AI, and innovate with multilingual solutions.',
            hero_cta_primary: 'Schedule a Consultation',
            hero_cta: 'Explore Our Services',

            stat_1: 'Years of Experience',
            stat_2: 'Open Source',
            stat_3: 'Languages Supported',
            stat_4: 'Quebec-Based',

            features_title: 'Three Core Service Pillars',
            features_subtitle: 'Comprehensive solutions for modern challenges',

            feature_1_title: 'Custom AI Solutions',
            feature_1_desc: 'Document intelligence, predictive analytics, NLP, and computer vision. We build AI that delivers measurable ROI, from concept to production deployment.',
            feature_2_title: 'Legacy System Modernization',
            feature_2_desc: 'Transform aging systems into modern, cloud-ready applications. API development, incremental migration, and integration with new technologies while preserving business logic.',
            feature_3_title: 'Multilingual AI Excellence',
            feature_3_desc: 'True multilingual AI capabilities in English, French, and German. Multilingual chatbots, document processing, and NLP solutions for government and enterprise requirements worldwide.',
            feature_4_title: 'Full-Stack Development',
            feature_4_desc: 'End-to-end software development from database design to user interfaces. Web applications, APIs, microservices, and system integration using modern open-source technologies.',

            tech_title: 'Modern, Open-Source Technology Stack',
            tech_subtitle: 'Industry-leading tools and frameworks',

            cta_title: 'Ready to Modernize and Innovate?',
            cta_subtitle: 'Let\'s discuss how we can help your organization leverage AI and modern technology',
            cta_button: 'Get Started',
            cta_button_2: 'View Case Studies'
        },

        // About page
        about: {
            title: 'Experience Meets Innovation',
            subtitle: '35+ years of software engineering expertise applied to modern AI challenges',

            mission_title: 'Our Story',
            mission_content: 'Founded in 2023 and based in Quebec, Canada, Quantum Gaze Software Inc. brings over three decades of software engineering excellence to the modern AI era. Led by a seasoned full-stack architect with 35+ years of experience spanning mainframes to microservices, we serve government and enterprise organizations in Canada and internationally. Our multilingual capabilities (English, French, German) and focus on practical AI solutions set us apart.',

            expertise_title: 'Our Core Capabilities',
            expertise_1_title: 'Custom AI Development',
            expertise_1_content: 'Document intelligence, natural language processing, predictive analytics, and computer vision solutions. We implement AI where it delivers real business value, not AI for marketing purposes.',

            expertise_2_title: 'Legacy System Modernization',
            expertise_2_content: 'Transform aging systems into modern applications. With 35+ years of experience across technologies from COBOL to React, we understand legacy systems and how to migrate them safely and incrementally.',

            expertise_3_title: 'Multilingual AI Solutions',
            expertise_3_content: 'True multilingual AI capabilities in English, French, and German. Not machine translation, but native understanding of multiple languages for government and enterprise needs worldwide.',

            expertise_4_title: 'Full-Stack Development',
            expertise_4_content: 'Complete software development services: web applications, APIs, databases, microservices, and system integration using modern open-source technologies.',

            expertise_5_title: 'Government-Ready Partner',
            expertise_5_content: 'Based in Quebec, Canada with multilingual capability, security focus, and data sovereignty options. Ready to work with government procurement processes and requirements in Canada and internationally.',

            why_title: 'Why Choose Quantum Gaze',
            why_1_title: '35+ Years of Real Experience',
            why_1_content: 'Deep technical expertise across the entire technology evolution - from mainframes and client-server to cloud and AI. We\'ve seen what works and what doesn\'t across diverse industries and regions.',

            why_2_title: 'Multilingual by Design',
            why_2_content: 'True multilingual capability (English, French, German) for AI, applications, and documentation. Essential for Canadian government, European markets, and global enterprises.',

            why_3_title: 'Pragmatic AI Approach',
            why_3_content: 'We focus on AI implementations that deliver measurable ROI. No hype, no buzzwords - just practical solutions that solve real business problems worldwide.',

            why_4_title: 'Global Reach, Local Excellence',
            why_4_content: 'Based in Quebec, Canada, serving clients internationally. We combine local expertise with global standards, offering data sovereignty options and commitment to multilingual excellence.',

            cta_title: 'Ready to Work Together?',
            cta_subtitle: 'Let\'s discuss how our experience and expertise can help your project succeed',
            cta_button: 'Schedule a Consultation'
        },

        // Services page
        services: {
            title: 'Software Development & AI Services',
            subtitle: 'Comprehensive technology solutions for government and enterprise',

            service_1_title: 'Custom AI Development',
            service_1_content: 'Build AI solutions that deliver measurable business value: document intelligence for automated data extraction, natural language processing for customer service and content analysis, predictive analytics for forecasting, and computer vision for image analysis. From prototype to production deployment.',

            service_2_title: 'Legacy System Modernization',
            service_2_content: 'Transform aging systems into modern, maintainable applications. Comprehensive assessment and roadmapping, incremental migration strategies that minimize risk, API development to expose legacy functionality, cloud migration and containerization, and integration with modern technologies.',

            service_3_title: 'Multilingual AI Solutions',
            service_3_content: 'Specialized multilingual AI solutions in English, French, and German for government and enterprise worldwide. Multilingual chatbots and virtual assistants, document processing in multiple languages, translation with business context awareness, multilingual search and knowledge management, and content moderation across languages.',

            service_4_title: 'Full-Stack Web Development',
            service_4_content: 'Complete web application development using modern frameworks and best practices. Single-page applications (React, Vue.js), RESTful APIs and microservices, database design and optimization, authentication and security implementation, and responsive design for all devices.',

            service_5_title: 'System Integration & APIs',
            service_5_content: 'Connect disparate systems and enable data flow across your organization. API design and development (REST, GraphQL), third-party service integration, ETL and data pipeline development, message queue implementation, and legacy system wrapper APIs.',

            service_6_title: 'Technical Consulting & Architecture',
            service_6_content: 'Expert guidance for technology decisions and system design. Technology stack selection and evaluation, system architecture design and review, code review and quality assessment, performance optimization, and team mentoring and knowledge transfer.'
        },

        // Solutions page
        solutions: {
            title: 'Products & Solution Offerings',
            subtitle: 'Reusable solutions and packaged services for common business needs',

            solution_1_title: 'Document Intelligence Platform',
            solution_1_subtitle: 'AI-powered document processing and data extraction',
            solution_1_content: 'Automated extraction and processing of business documents: invoices, purchase orders, receipts, forms, and contracts. Reduce manual data entry, improve accuracy, and accelerate document workflows with AI-powered OCR and intelligent extraction.',
            solution_1_feature_1: 'Multilingual document processing (English, French, German)',
            solution_1_feature_2: 'REST API for easy integration',
            solution_1_feature_3: 'Pre-trained models for common document types',
            solution_1_feature_4: 'Custom training for specialized document formats',

            solution_2_title: 'Multilingual AI Toolkit',
            solution_2_subtitle: 'English, French, German NLP and language solutions',
            solution_2_content: 'Complete toolkit for building multilingual AI applications. Includes multilingual chatbot framework, translation API with business context, sentiment analysis, entity recognition, and text classification for English, French, and German content.',
            solution_2_feature_1: 'Native English, French, and German language understanding',
            solution_2_feature_2: 'Easy integration with existing applications',
            solution_2_feature_3: 'Government-ready compliance and data sovereignty',
            solution_2_feature_4: 'Flexible deployment options (cloud or on-premise)',

            cta_title: 'Interested in Our Solutions?',
            cta_content: 'Contact us to discuss how these solutions can be customized for your specific needs, or inquire about custom development services.',
            cta_button: 'Get in Touch'
        },

        // Industries page
        industries: {
            title: 'Target Markets & Sectors',
            subtitle: 'Serving clients in Canada, United States, Europe, and beyond',

            industry_1_title: 'Government & Public Sector',
            industry_1_content: 'Government agencies in Canada, Europe, and internationally at federal, provincial/state, and municipal levels. Legacy system modernization for critical infrastructure, multilingual citizen-facing applications meeting accessibility standards, document processing and automation for permits and forms, API development for data exchange, and secure solutions with data sovereignty options.',

            industry_2_title: 'Healthcare & Social Services',
            industry_2_content: 'Healthcare providers, hospitals, and social service organizations worldwide. HIPAA and GDPR-compliant solutions, patient data management systems, appointment scheduling and management, multilingual patient portals and communication tools, integration with existing EMR/EHR systems, and document processing for medical records and insurance claims.',

            industry_3_title: 'Financial Services & Insurance',
            industry_3_content: 'Banks, credit unions, insurance companies, and fintech startups. Secure transaction processing, regulatory compliance and reporting, document intelligence for claims and applications, fraud detection and risk assessment, bilingual customer service chatbots, and legacy banking system modernization.',

            industry_4_title: 'Manufacturing & Distribution',
            industry_4_content: 'Manufacturers, distributors, and supply chain organizations. Inventory management and optimization, supplier and partner integration, quality control and traceability systems, predictive maintenance using AI, legacy ERP modernization, and bilingual documentation and training systems.',

            industry_5_title: 'Professional Services',
            industry_5_content: 'Law firms, accounting firms, consulting companies, and service providers. Document management and automation, client portal development, billing and time tracking systems, case management systems, bilingual reporting and client communications, and integration with industry-specific software.',

            industry_6_title: 'Education & Research',
            industry_6_content: 'Universities, colleges, research institutions, and training organizations. Student information systems, learning management platforms, bilingual course content and materials, research data management and analysis, grant management systems, and integration with government reporting requirements.'
        },

        // Contact page
        contact: {
            title: 'Let\'s Discuss Your Project',
            subtitle: 'AI solutions and software development for organizations worldwide',

            get_in_touch: 'Contact Information',
            phone: 'Phone',
            email: 'Email',
            hours: 'Business Hours',
            hours_content: 'Monday - Thursday: 9:00 AM - 6:00 PM\nFriday: 8:00 AM - 4:00 PM\nSaturday: Closed\nSunday: 10:00 AM - 4:00 PM',

            who_we_are: 'About Quantum Gaze',
            who_content: 'Quantum Gaze Software Inc. is a Quebec-based software development company founded in 2023, serving clients in Canada and internationally. With over 35 years of software engineering experience, we specialize in custom AI development, legacy system modernization, and multilingual solutions (English, French, German) for government and enterprise clients worldwide. We combine deep technical expertise with modern AI capabilities to deliver practical, production-ready solutions.',

            form_title: 'Start a Conversation',
            first_name: 'First Name',
            last_name: 'Last Name',
            email_label: 'Email Address',
            message: 'Tell us about your project or challenge',
            send: 'Send Message',
            success: 'Thank you! We will respond within 24 business hours.'
        },

        // Footer
        footer: {
            contact: 'Contact',
            phone: 'Phone',
            email: 'Email',
            follow: 'Follow Us',
            who_title: 'About Our Platform',
            who_content: 'Quantum Gaze Software Inc. delivers AI-powered solutions and legacy system modernization for government and enterprise clients worldwide. Based in Quebec, Canada, we combine 35+ years of software engineering expertise with modern AI capabilities and multilingual support (English, French, German).',
            copyright: '© 2024 Quantum Gaze Software Inc. All rights reserved.',
            neq: 'QC Business Number',
            sitemap: 'Sitemap',
            contact_us: 'Contact'
        }
    },

    fr: {
        // Navigation
        nav: {
            home: 'Accueil',
            services: 'Services',
            solutions: 'Solutions',
            industries: 'Marchés',
            about: 'À propos',
            contact: 'Contact'
        },

        // Homepage
        home: {
            hero_badge: 'Basé au Québec • Excellence Multilingue • Plus de 35 ans d\'expérience',
            hero_title: 'Solutions IA et Modernisation de Systèmes Patrimoniaux',
            hero_subtitle: 'Plus de 35 ans d\'expertise en génie logiciel rencontre l\'IA de pointe. Nous aidons les organisations gouvernementales et d\'entreprise au Canada et à l\'international à moderniser leurs systèmes patrimoniaux, automatiser avec l\'IA et innover avec des solutions multilingues.',
            hero_cta_primary: 'Planifier une Consultation',
            hero_cta: 'Découvrir Nos Services',

            stat_1: 'Années d\'Expérience',
            stat_2: 'Open Source',
            stat_3: 'Langues Supportées',
            stat_4: 'Basé au Québec',

            features_title: 'Trois Piliers de Services Principaux',
            features_subtitle: 'Solutions complètes pour les défis modernes',

            feature_1_title: 'Solutions IA Personnalisées',
            feature_1_desc: 'Intelligence documentaire, analytique prédictive, traitement du langage naturel et vision par ordinateur. Nous développons de l\'IA qui génère un ROI mesurable, du concept au déploiement en production.',
            feature_2_title: 'Modernisation de Systèmes Patrimoniaux',
            feature_2_desc: 'Transformez les systèmes vieillissants en applications modernes prêtes pour le cloud. Développement d\'API, migration incrémentale et intégration avec les nouvelles technologies tout en préservant la logique métier.',
            feature_3_title: 'Excellence IA Multilingue',
            feature_3_desc: 'Véritables capacités IA multilingues en anglais, français et allemand. Chatbots multilingues, traitement de documents et solutions de traitement du langage naturel pour les exigences gouvernementales et d\'entreprise mondiales.',
            feature_4_title: 'Développement Full-Stack',
            feature_4_desc: 'Développement logiciel de bout en bout, de la conception de bases de données aux interfaces utilisateur. Applications web, API, microservices et intégration de systèmes utilisant des technologies open-source modernes.',

            tech_title: 'Stack Technologique Moderne et Open-Source',
            tech_subtitle: 'Outils et frameworks leaders de l\'industrie',

            cta_title: 'Prêt à Moderniser et Innover?',
            cta_subtitle: 'Discutons de comment nous pouvons aider votre organisation à tirer parti de l\'IA et de la technologie moderne',
            cta_button: 'Commencer',
            cta_button_2: 'Voir les Études de Cas'
        },

        // About page
        about: {
            title: 'L\'Expérience Rencontre l\'Innovation',
            subtitle: 'Plus de 35 ans d\'expertise en génie logiciel appliquée aux défis IA modernes',

            mission_title: 'Notre Histoire',
            mission_content: 'Fondée en 2023 et basée au Québec, Canada, Logiciel Quantum Gaze Inc. apporte plus de trois décennies d\'excellence en génie logiciel à l\'ère moderne de l\'IA. Dirigée par un architecte full-stack chevronné avec plus de 35 ans d\'expérience, du mainframe aux microservices, nous servons les organisations gouvernementales et d\'entreprise au Canada et à l\'international. Nos capacités multilingues (anglais, français, allemand) et notre concentration sur des solutions IA pratiques nous distinguent.',

            expertise_title: 'Nos Capacités Principales',
            expertise_1_title: 'Développement IA Personnalisé',
            expertise_1_content: 'Intelligence documentaire, traitement du langage naturel, analytique prédictive et solutions de vision par ordinateur. Nous mettons en œuvre l\'IA là où elle apporte une réelle valeur commerciale, pas de l\'IA à des fins marketing.',

            expertise_2_title: 'Modernisation de Systèmes Patrimoniaux',
            expertise_2_content: 'Transformez les systèmes vieillissants en applications modernes. Avec plus de 35 ans d\'expérience dans les technologies de COBOL à React, nous comprenons les systèmes patrimoniaux et comment les migrer de manière sécuritaire et incrémentale.',

            expertise_3_title: 'Solutions IA Multilingues',
            expertise_3_content: 'Véritables capacités IA multilingues en anglais, français et allemand. Pas de traduction automatique, mais une compréhension native de plusieurs langues pour les besoins gouvernementaux et d\'entreprise mondiaux.',

            expertise_4_title: 'Développement Full-Stack',
            expertise_4_content: 'Services complets de développement logiciel : applications web, API, bases de données, microservices et intégration de systèmes utilisant des technologies open-source modernes.',

            expertise_5_title: 'Partenaire Prêt pour le Gouvernement',
            expertise_5_content: 'Basé au Québec avec capacité bilingue, focus sécuritaire et souveraineté des données canadiennes. Prêt à travailler avec les processus et exigences d\'approvisionnement gouvernemental.',

            why_title: 'Pourquoi Choisir Quantum Gaze',
            why_1_title: 'Plus de 35 Ans d\'Expérience Réelle',
            why_1_content: 'Expertise technique approfondie à travers toute l\'évolution technologique - du mainframe et client-serveur au cloud et à l\'IA. Nous avons vu ce qui fonctionne et ce qui ne fonctionne pas.',

            why_2_title: 'Bilingue par Conception',
            why_2_content: 'Véritable capacité français-anglais pour l\'IA, les applications et la documentation. Essentiel pour le gouvernement canadien et le marché québécois.',

            why_3_title: 'Approche IA Pragmatique',
            why_3_content: 'Nous nous concentrons sur les implémentations d\'IA qui génèrent un ROI mesurable. Pas de battage médiatique, pas de mots à la mode - juste des solutions pratiques qui résolvent de vrais problèmes commerciaux.',

            why_4_title: 'Basé au Québec, Valeurs Canadiennes',
            why_4_content: 'Entreprise locale soutenant l\'économie québécoise. Souveraineté des données canadiennes, normes d\'accessibilité et engagement envers l\'excellence bilingue.',

            cta_title: 'Prêt à Travailler Ensemble?',
            cta_subtitle: 'Discutons de comment notre expérience et notre expertise peuvent aider votre projet à réussir',
            cta_button: 'Planifier une Consultation'
        },

        // Services page
        services: {
            title: 'Services de Développement Logiciel et IA',
            subtitle: 'Solutions technologiques complètes pour les organisations canadiennes',

            service_1_title: 'Développement IA Personnalisé',
            service_1_content: 'Construisez des solutions IA qui apportent une valeur commerciale mesurable : intelligence documentaire pour l\'extraction automatisée de données, traitement du langage naturel pour le service client et l\'analyse de contenu, analytique prédictive pour les prévisions, et vision par ordinateur pour l\'analyse d\'images. Du prototype au déploiement en production.',

            service_2_title: 'Modernisation de Systèmes Patrimoniaux',
            service_2_content: 'Transformez les systèmes vieillissants en applications modernes et maintenables. Évaluation et feuille de route complètes, stratégies de migration incrémentale minimisant les risques, développement d\'API pour exposer les fonctionnalités patrimoniales, migration cloud et conteneurisation, et intégration avec les technologies modernes.',

            service_3_title: 'Solutions IA Bilingues',
            service_3_content: 'Solutions IA français-anglais spécialisées pour le gouvernement et les entreprises canadiennes. Chatbots et assistants virtuels bilingues, traitement de documents dans les deux langues officielles, traduction avec compréhension du contexte commercial, gestion des connaissances et recherche bilingues, et modération de contenu en français et anglais.',

            service_4_title: 'Développement Web Full-Stack',
            service_4_content: 'Développement complet d\'applications web utilisant des frameworks modernes et les meilleures pratiques. Applications monopage (React, Vue.js), API RESTful et microservices, conception et optimisation de bases de données, implémentation d\'authentification et de sécurité, et conception responsive pour tous les appareils.',

            service_5_title: 'Intégration de Systèmes et API',
            service_5_content: 'Connectez des systèmes disparates et permettez le flux de données à travers votre organisation. Conception et développement d\'API (REST, GraphQL), intégration de services tiers, développement de pipelines ETL et de données, implémentation de files d\'attente de messages, et API d\'encapsulation de systèmes patrimoniaux.',

            service_6_title: 'Consultation Technique et Architecture',
            service_6_content: 'Conseils d\'experts pour les décisions technologiques et la conception de systèmes. Sélection et évaluation de stack technologique, conception et révision d\'architecture système, révision de code et évaluation de qualité, optimisation des performances, et mentorat d\'équipe et transfert de connaissances.'
        },

        // Solutions page
        solutions: {
            title: 'Produits et Offres de Solutions',
            subtitle: 'Solutions réutilisables et services packagés pour les besoins commerciaux courants',

            solution_1_title: 'Plateforme d\'Intelligence Documentaire',
            solution_1_subtitle: 'Traitement et extraction de données alimentés par l\'IA',
            solution_1_content: 'Extraction et traitement automatisés de documents commerciaux : factures, bons de commande, reçus, formulaires et contrats. Réduisez la saisie manuelle, améliorez la précision et accélérez les workflows documentaires avec OCR alimenté par l\'IA et extraction intelligente.',
            solution_1_feature_1: 'Traitement de documents bilingue (français et anglais)',
            solution_1_feature_2: 'API REST pour une intégration facile',
            solution_1_feature_3: 'Modèles pré-entraînés pour types de documents courants',
            solution_1_feature_4: 'Formation personnalisée pour formats de documents spécialisés',

            solution_2_title: 'Boîte à Outils IA Bilingue',
            solution_2_subtitle: 'Solutions de traitement du langage naturel français-anglais',
            solution_2_content: 'Boîte à outils complète pour construire des applications IA bilingues. Inclut cadre de chatbot bilingue, API de traduction avec contexte commercial, analyse de sentiment, reconnaissance d\'entités et classification de texte pour le contenu français et anglais.',
            solution_2_feature_1: 'Compréhension native des langues française et anglaise',
            solution_2_feature_2: 'Intégration facile avec les applications existantes',
            solution_2_feature_3: 'Conformité et souveraineté des données prêtes pour le gouvernement',
            solution_2_feature_4: 'Options de déploiement flexibles (cloud ou sur site)',

            cta_title: 'Intéressé par Nos Solutions?',
            cta_content: 'Contactez-nous pour discuter de la façon dont ces solutions peuvent être personnalisées pour vos besoins spécifiques, ou renseignez-vous sur nos services de développement personnalisé.',
            cta_button: 'Nous Contacter'
        },

        // Industries page
        industries: {
            title: 'Marchés Cibles et Secteurs',
            subtitle: 'Solutions spécialisées pour le gouvernement et les entreprises',

            industry_1_title: 'Gouvernement et Secteur Public',
            industry_1_content: 'Agences gouvernementales du Québec et du Canada aux niveaux fédéral, provincial et municipal. Modernisation de systèmes patrimoniaux pour infrastructures critiques, applications bilingues pour citoyens respectant les normes d\'accessibilité, traitement et automatisation de documents pour permis et formulaires, développement d\'API pour échange de données, et solutions sécurisées respectant la souveraineté des données canadiennes.',

            industry_2_title: 'Santé et Services Sociaux',
            industry_2_content: 'Fournisseurs de soins de santé, hôpitaux et organisations de services sociaux. Solutions conformes HIPAA, systèmes de gestion de données patients, planification et gestion de rendez-vous, portails patients bilingues et outils de communication, intégration avec systèmes EMR/EHR existants, et traitement de documents pour dossiers médicaux et réclamations d\'assurance.',

            industry_3_title: 'Services Financiers et Assurance',
            industry_3_content: 'Banques, caisses populaires, compagnies d\'assurance et startups fintech. Traitement sécurisé des transactions, conformité et rapports réglementaires, intelligence documentaire pour réclamations et applications, détection de fraude et évaluation des risques, chatbots de service client bilingues, et modernisation de systèmes bancaires patrimoniaux.',

            industry_4_title: 'Fabrication et Distribution',
            industry_4_content: 'Fabricants, distributeurs et organisations de chaîne d\'approvisionnement. Gestion et optimisation d\'inventaire, intégration de fournisseurs et partenaires, systèmes de contrôle qualité et traçabilité, maintenance prédictive utilisant l\'IA, modernisation d\'ERP patrimonial, et systèmes de documentation et formation bilingues.',

            industry_5_title: 'Services Professionnels',
            industry_5_content: 'Cabinets d\'avocats, cabinets comptables, entreprises de consultation et fournisseurs de services. Gestion et automatisation de documents, développement de portails clients, systèmes de facturation et suivi du temps, systèmes de gestion de dossiers, rapports bilingues et communications clients, et intégration avec logiciels spécifiques à l\'industrie.',

            industry_6_title: 'Éducation et Recherche',
            industry_6_content: 'Universités, collèges, instituts de recherche et organisations de formation. Systèmes d\'information étudiants, plateformes de gestion d\'apprentissage, contenu et matériel de cours bilingues, gestion et analyse de données de recherche, systèmes de gestion de subventions, et intégration avec exigences de rapports gouvernementaux.'
        },

        // Contact page
        contact: {
            title: 'Discutons de Votre Projet',
            subtitle: 'Solutions IA et développement logiciel pour organisations canadiennes',

            get_in_touch: 'Coordonnées',
            phone: 'Téléphone',
            email: 'Courriel',
            hours: 'Heures d\'Ouverture',
            hours_content: 'Lundi - Jeudi : 9h00 - 18h00\nVendredi : 8h00 - 16h00\nSamedi : Fermé\nDimanche : 10h00 - 16h00',

            who_we_are: 'À Propos de Quantum Gaze',
            who_content: 'Logiciel Quantum Gaze Inc. est une entreprise de développement logiciel basée au Québec fondée en 2023. Avec plus de 35 ans d\'expérience en génie logiciel, nous nous spécialisons dans le développement d\'IA personnalisé, la modernisation de systèmes patrimoniaux et les solutions bilingues pour les clients gouvernementaux et entreprises canadiens. Nous combinons une expertise technique approfondie avec des capacités IA modernes pour offrir des solutions pratiques et prêtes pour la production.',

            form_title: 'Entamer une Conversation',
            first_name: 'Prénom',
            last_name: 'Nom',
            email_label: 'Adresse Courriel',
            message: 'Parlez-nous de votre projet ou défi',
            send: 'Envoyer le Message',
            success: 'Merci! Nous répondrons dans les 24 heures ouvrables.'
        },

        // Footer
        footer: {
            contact: 'Contact',
            phone: 'Téléphone',
            email: 'Courriel',
            follow: 'Suivez-nous',
            who_title: 'À Propos de Notre Plateforme',
            who_content: 'Logiciel Quantum Gaze Inc. offre une intégration EDI de niveau entreprise alimentée par l\'IA et les systèmes agentiques. Notre plateforme combine l\'automatisation Python, les workflows n8n et l\'apprentissage automatique pour transformer l\'échange de données B2B pour les organisations mondiales.',
            copyright: '© 2024 Logiciel Quantum Gaze Inc. Tous droits réservés.',
            neq: 'NEQ',
            sitemap: 'Plan du site',
            contact_us: 'Contactez-nous'
        }
    },

    de: {
        // Navigation
        nav: {
            home: 'Startseite',
            services: 'Dienstleistungen',
            solutions: 'Lösungen',
            industries: 'Märkte',
            about: 'Über uns',
            contact: 'Kontakt'
        },

        // Homepage
        home: {
            hero_badge: 'Québec-Ansässig • Mehrsprachige Exzellenz • Über 35 Jahre Erfahrung',
            hero_title: 'KI-Lösungen & Legacy-System-Modernisierung',
            hero_subtitle: 'Über 35 Jahre Software-Engineering-Expertise trifft auf modernste KI. Wir helfen Regierungs- und Unternehmensorganisationen in Kanada und international, Legacy-Systeme zu modernisieren, mit KI zu automatisieren und mit mehrsprachigen Lösungen zu innovieren.',
            hero_cta_primary: 'Beratungsgespräch vereinbaren',
            hero_cta: 'Unsere Dienstleistungen',

            stat_1: 'Jahre Erfahrung',
            stat_2: 'Open Source',
            stat_3: 'Unterstützte Sprachen',
            stat_4: 'Québec-Ansässig',

            features_title: 'Drei Kern-Dienstleistungssäulen',
            features_subtitle: 'Umfassende Lösungen für moderne Herausforderungen',

            feature_1_title: 'Maßgeschneiderte KI-Lösungen',
            feature_1_desc: 'Dokumentenintelligenz, Predictive Analytics, NLP und Computer Vision. Wir entwickeln KI mit messbarem ROI, vom Konzept bis zur Produktionsbereitstellung.',
            feature_2_title: 'Legacy-System-Modernisierung',
            feature_2_desc: 'Transformieren Sie veraltete Systeme in moderne, cloud-fähige Anwendungen. API-Entwicklung, inkrementelle Migration und Integration neuer Technologien unter Beibehaltung der Geschäftslogik.',
            feature_3_title: 'Mehrsprachige KI-Exzellenz',
            feature_3_desc: 'Echte mehrsprachige KI-Fähigkeiten in Englisch, Französisch und Deutsch. Mehrsprachige Chatbots, Dokumentenverarbeitung und NLP-Lösungen für behördliche und unternehmerische Anforderungen weltweit.',
            feature_4_title: 'Full-Stack-Entwicklung',
            feature_4_desc: 'End-to-End-Softwareentwicklung von Datenbankdesign bis zu Benutzeroberflächen. Webanwendungen, APIs, Microservices und Systemintegration mit modernen Open-Source-Technologien.',

            tech_title: 'Moderner Open-Source-Technologie-Stack',
            tech_subtitle: 'Branchenführende Tools und Frameworks',

            cta_title: 'Bereit zu modernisieren und innovieren?',
            cta_subtitle: 'Lassen Sie uns besprechen, wie wir Ihrem Unternehmen helfen können, KI und moderne Technologie zu nutzen',
            cta_button: 'Jetzt starten',
            cta_button_2: 'Fallstudien ansehen'
        },

        // About page
        about: {
            title: 'Erfahrung trifft Innovation',
            subtitle: 'Über 35 Jahre Software-Engineering-Expertise auf moderne KI-Herausforderungen angewandt',

            mission_title: 'Unsere Geschichte',
            mission_content: 'Quantum Gaze Software Inc. wurde 2023 gegründet und hat seinen Sitz in Québec, Kanada. Wir bringen über drei Jahrzehnte Software-Engineering-Exzellenz in die moderne KI-Ära ein. Geleitet von einem erfahrenen Full-Stack-Architekten mit über 35 Jahren Erfahrung von Mainframes bis Microservices, bedienen wir Regierungs- und Unternehmensorganisationen in Kanada und international. Unsere mehrsprachigen Fähigkeiten (Englisch, Französisch, Deutsch) und unser Fokus auf praktische KI-Lösungen zeichnen uns aus.',

            expertise_title: 'Unsere Kernkompetenzen',
            expertise_1_title: 'Maßgeschneiderte KI-Entwicklung',
            expertise_1_content: 'Dokumentenintelligenz, natürliche Sprachverarbeitung, Predictive Analytics und Computer-Vision-Lösungen. Wir implementieren KI dort, wo sie echten Geschäftswert liefert, nicht KI für Marketingzwecke.',

            expertise_2_title: 'Legacy-System-Modernisierung',
            expertise_2_content: 'Transformieren Sie veraltete Systeme in moderne Anwendungen. Mit über 35 Jahren Erfahrung mit Technologien von COBOL bis React verstehen wir Legacy-Systeme und wie man sie sicher und schrittweise migriert.',

            expertise_3_title: 'Mehrsprachige KI-Lösungen',
            expertise_3_content: 'Echte mehrsprachige KI-Fähigkeiten in Englisch, Französisch und Deutsch. Keine maschinelle Übersetzung, sondern natives Verständnis mehrerer Sprachen für behördliche und unternehmerische Bedürfnisse weltweit.',

            expertise_4_title: 'Full-Stack-Entwicklung',
            expertise_4_content: 'Komplette Softwareentwicklungsdienste: Webanwendungen, APIs, Datenbanken, Microservices und Systemintegration mit modernen Open-Source-Technologien.',

            expertise_5_title: 'Behördengeeigneter Partner',
            expertise_5_content: 'Ansässig in Québec, Kanada mit mehrsprachiger Kompetenz, Sicherheitsfokus und Datensouveränitätsoptionen. Bereit für Beschaffungsprozesse und Anforderungen von Behörden in Kanada und international.',

            why_title: 'Warum Quantum Gaze wählen',
            why_1_title: 'Über 35 Jahre reale Erfahrung',
            why_1_content: 'Tiefe technische Expertise über die gesamte Technologieentwicklung hinweg - von Mainframes und Client-Server bis Cloud und KI. Wir haben gesehen, was funktioniert und was nicht, über verschiedene Branchen und Regionen hinweg.',

            why_2_title: 'Mehrsprachig konzipiert',
            why_2_content: 'Echte mehrsprachige Fähigkeiten (Englisch, Französisch, Deutsch) für KI, Anwendungen und Dokumentation. Unerlässlich für kanadische Regierungen, europäische Märkte und globale Unternehmen.',

            why_3_title: 'Pragmatischer KI-Ansatz',
            why_3_content: 'Wir konzentrieren uns auf KI-Implementierungen, die messbaren ROI liefern. Kein Hype, keine Schlagworte - nur praktische Lösungen, die echte Geschäftsprobleme weltweit lösen.',

            why_4_title: 'Globale Reichweite, Lokale Exzellenz',
            why_4_content: 'Ansässig in Québec, Kanada, bedienen wir Kunden international. Wir kombinieren lokale Expertise mit globalen Standards und bieten Datensouveränitätsoptionen und Engagement für mehrsprachige Exzellenz.',

            cta_title: 'Bereit zusammenzuarbeiten?',
            cta_subtitle: 'Lassen Sie uns besprechen, wie unsere Erfahrung und Expertise Ihrem Projekt zum Erfolg verhelfen können',
            cta_button: 'Beratung vereinbaren'
        },

        // Services page
        services: {
            title: 'Softwareentwicklung & KI-Dienstleistungen',
            subtitle: 'Umfassende Technologielösungen für Behörden und Unternehmen',

            service_1_title: 'Maßgeschneiderte KI-Entwicklung',
            service_1_content: 'Entwickeln Sie KI-Lösungen mit messbarem Geschäftswert: Dokumentenintelligenz für automatisierte Datenextraktion, natürliche Sprachverarbeitung für Kundenservice und Inhaltsanalyse, Predictive Analytics für Prognosen und Computer Vision für Bildanalyse. Vom Prototyp bis zur Produktionsbereitstellung.',

            service_2_title: 'Legacy-System-Modernisierung',
            service_2_content: 'Transformieren Sie veraltete Systeme in moderne, wartbare Anwendungen. Umfassende Bewertung und Roadmapping, inkrementelle Migrationsstrategien zur Risikominimierung, API-Entwicklung zur Offenlegung von Legacy-Funktionalität, Cloud-Migration und Containerisierung sowie Integration mit modernen Technologien.',

            service_3_title: 'Mehrsprachige KI-Lösungen',
            service_3_content: 'Spezialisierte mehrsprachige KI-Lösungen in Englisch, Französisch und Deutsch für Behörden und Unternehmen weltweit. Mehrsprachige Chatbots und virtuelle Assistenten, Dokumentenverarbeitung in mehreren Sprachen, Übersetzung mit Geschäftskontextbewusstsein, mehrsprachige Suche und Wissensmanagement sowie Inhaltsmoderation über Sprachen hinweg.',

            service_4_title: 'Full-Stack-Webentwicklung',
            service_4_content: 'Komplette Webanwendungsentwicklung mit modernen Frameworks und Best Practices. Single-Page-Anwendungen (React, Vue.js), RESTful APIs und Microservices, Datenbankdesign und -optimierung, Authentifizierungs- und Sicherheitsimplementierung sowie responsives Design für alle Geräte.',

            service_5_title: 'Systemintegration & APIs',
            service_5_content: 'Verbinden Sie disparate Systeme und ermöglichen Sie den Datenfluss in Ihrem Unternehmen. API-Design und -Entwicklung (REST, GraphQL), Integration von Drittanbieterdiensten, ETL- und Daten-Pipeline-Entwicklung, Message-Queue-Implementierung und Wrapper-APIs für Legacy-Systeme.',

            service_6_title: 'Technische Beratung & Architektur',
            service_6_content: 'Expertenrat für Technologieentscheidungen und Systemdesign. Auswahl und Bewertung von Technologie-Stacks, Systemarchitekturdesign und -überprüfung, Code-Review und Qualitätsbewertung, Leistungsoptimierung sowie Team-Mentoring und Wissenstransfer.'
        },

        // Solutions page
        solutions: {
            title: 'Produkte & Lösungsangebote',
            subtitle: 'Wiederverwendbare Lösungen und verpackte Dienstleistungen für gängige Geschäftsanforderungen',

            solution_1_title: 'Dokumentenintelligenz-Plattform',
            solution_1_subtitle: 'KI-gestützte Dokumentenverarbeitung und Datenextraktion',
            solution_1_content: 'Automatisierte Extraktion und Verarbeitung von Geschäftsdokumenten: Rechnungen, Bestellungen, Quittungen, Formulare und Verträge. Reduzieren Sie manuelle Dateneingabe, verbessern Sie die Genauigkeit und beschleunigen Sie Dokumenten-Workflows mit KI-gestützter OCR und intelligenter Extraktion.',
            solution_1_feature_1: 'Mehrsprachige Dokumentenverarbeitung (Englisch, Französisch, Deutsch)',
            solution_1_feature_2: 'REST-API für einfache Integration',
            solution_1_feature_3: 'Vortrainierte Modelle für gängige Dokumenttypen',
            solution_1_feature_4: 'Benutzerdefiniertes Training für spezialisierte Dokumentformate',

            solution_2_title: 'Mehrsprachiges KI-Toolkit',
            solution_2_subtitle: 'Englisch, Französisch, Deutsch NLP und Sprachlösungen',
            solution_2_content: 'Komplettes Toolkit zum Erstellen mehrsprachiger KI-Anwendungen. Enthält mehrsprachiges Chatbot-Framework, Übersetzungs-API mit Geschäftskontext, Stimmungsanalyse, Entitätserkennung und Textklassifizierung für englische, französische und deutsche Inhalte.',
            solution_2_feature_1: 'Natives Englisch-, Französisch- und Deutschsprachverständnis',
            solution_2_feature_2: 'Einfache Integration in bestehende Anwendungen',
            solution_2_feature_3: 'Behördengeeignete Compliance und Datensouveränität',
            solution_2_feature_4: 'Flexible Bereitstellungsoptionen (Cloud oder On-Premise)',

            cta_title: 'Interessiert an unseren Lösungen?',
            cta_content: 'Kontaktieren Sie uns, um zu besprechen, wie diese Lösungen für Ihre spezifischen Anforderungen angepasst werden können, oder erkundigen Sie sich nach maßgeschneiderten Entwicklungsdienstleistungen.',
            cta_button: 'Kontakt aufnehmen'
        },

        // Industries page
        industries: {
            title: 'Zielmärkte & Sektoren',
            subtitle: 'Bedienung von Kunden in Kanada, den Vereinigten Staaten, Europa und darüber hinaus',

            industry_1_title: 'Regierung & Öffentlicher Sektor',
            industry_1_content: 'Regierungsbehörden in Kanada, Europa und international auf föderaler, provinzieller/bundesstaatlicher und kommunaler Ebene. Legacy-System-Modernisierung für kritische Infrastruktur, mehrsprachige bürgerorientierte Anwendungen mit Barrierefreiheitsstandards, Dokumentenverarbeitung und -automatisierung für Genehmigungen und Formulare, API-Entwicklung für Datenaustausch und sichere Lösungen mit Datensouveränitätsoptionen.',

            industry_2_title: 'Gesundheitswesen & Soziale Dienste',
            industry_2_content: 'Gesundheitsdienstleister, Krankenhäuser und Sozialdienstorganisationen weltweit. HIPAA- und DSGVO-konforme Lösungen, Patientendatenmanagementsysteme, Terminplanung und -verwaltung, mehrsprachige Patientenportale und Kommunikationstools, Integration mit bestehenden EMR/EHR-Systemen und Dokumentenverarbeitung für Krankenakten und Versicherungsansprüche.',

            industry_3_title: 'Finanzdienstleistungen & Versicherungen',
            industry_3_content: 'Banken, Kreditgenossenschaften, Versicherungsgesellschaften und Fintech-Startups. Sichere Transaktionsverarbeitung, Regulierungskonformität und Berichterstattung, Dokumentenintelligenz für Ansprüche und Anträge, Betrugserkennung und Risikobewertung, mehrsprachige Kundenservice-Chatbots und Modernisierung von Legacy-Banksystemen.',

            industry_4_title: 'Fertigung & Vertrieb',
            industry_4_content: 'Hersteller, Händler und Supply-Chain-Organisationen. Bestandsverwaltung und -optimierung, Lieferanten- und Partnerintegration, Qualitätskontroll- und Rückverfolgbarkeitssysteme, vorausschauende Wartung mit KI, Legacy-ERP-Modernisierung und mehrsprachige Dokumentations- und Schulungssysteme.',

            industry_5_title: 'Professionelle Dienstleistungen',
            industry_5_content: 'Anwaltskanzleien, Wirtschaftsprüfungsgesellschaften, Beratungsunternehmen und Dienstleister. Dokumentenmanagement und -automatisierung, Kundenportalentwicklung, Abrechnungs- und Zeiterfassungssysteme, Fallmanagementsysteme, mehrsprachige Berichterstattung und Kundenkommunikation sowie Integration mit branchenspezifischer Software.',

            industry_6_title: 'Bildung & Forschung',
            industry_6_content: 'Universitäten, Hochschulen, Forschungseinrichtungen und Schulungsorganisationen. Studenteninformationssysteme, Lernmanagementsysteme, mehrsprachige Kursinhalte und -materialien, Forschungsdatenverwaltung und -analyse, Stipendienverwaltungssysteme und Integration mit behördlichen Berichtsanforderungen.'
        },

        // Contact page
        contact: {
            title: 'Lassen Sie uns über Ihr Projekt sprechen',
            subtitle: 'KI-Lösungen und Softwareentwicklung für Organisationen weltweit',

            get_in_touch: 'Kontaktinformationen',
            phone: 'Telefon',
            email: 'E-Mail',
            hours: 'Geschäftszeiten',
            hours_content: 'Montag - Donnerstag: 9:00 - 18:00 Uhr\nFreitag: 8:00 - 16:00 Uhr\nSamstag: Geschlossen\nSonntag: 10:00 - 16:00 Uhr',

            who_we_are: 'Über Quantum Gaze',
            who_content: 'Quantum Gaze Software Inc. ist ein in Québec ansässiges Softwareentwicklungsunternehmen, das 2023 gegründet wurde und Kunden in Kanada und international bedient. Mit über 35 Jahren Software-Engineering-Erfahrung spezialisieren wir uns auf maßgeschneiderte KI-Entwicklung, Legacy-System-Modernisierung und mehrsprachige Lösungen (Englisch, Französisch, Deutsch) für Regierungs- und Unternehmenskunden weltweit. Wir kombinieren tiefe technische Expertise mit modernen KI-Fähigkeiten, um praktische, produktionsreife Lösungen zu liefern.',

            form_title: 'Gespräch beginnen',
            first_name: 'Vorname',
            last_name: 'Nachname',
            email_label: 'E-Mail-Adresse',
            message: 'Erzählen Sie uns von Ihrem Projekt oder Ihrer Herausforderung',
            send: 'Nachricht senden',
            success: 'Vielen Dank! Wir werden innerhalb von 24 Geschäftsstunden antworten.'
        },

        // Footer
        footer: {
            contact: 'Kontakt',
            phone: 'Telefon',
            email: 'E-Mail',
            follow: 'Folgen Sie uns',
            who_title: 'Über unsere Plattform',
            who_content: 'Quantum Gaze Software Inc. liefert KI-gestützte Lösungen und Legacy-System-Modernisierung für Regierungs- und Unternehmenskunden weltweit. Mit Sitz in Québec, Kanada, kombinieren wir über 35 Jahre Software-Engineering-Expertise mit modernen KI-Fähigkeiten und mehrsprachiger Unterstützung (Englisch, Französisch, Deutsch).',
            copyright: '© 2024 Quantum Gaze Software Inc. Alle Rechte vorbehalten.',
            neq: 'QC Geschäftsnummer',
            sitemap: 'Sitemap',
            contact_us: 'Kontakt'
        }
    }
};

// Get current language
function getCurrentLanguage() {
    return localStorage.getItem('language') || 'en';
}

// Set language
function setLanguage(lang) {
    localStorage.setItem('language', lang);
    updatePageContent(lang);
}

// Update page content based on language
function updatePageContent(lang) {
    const t = translations[lang];

    // Update navigation
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        const keys = key.split('.');
        let value = t;

        keys.forEach(k => {
            if (value && value[k]) {
                value = value[k];
            }
        });

        if (typeof value === 'string') {
            if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                element.placeholder = value;
            } else {
                element.textContent = value;
            }
        }
    });

    // Update language selector
    const langSelector = document.getElementById('languageSelector');
    if (langSelector) {
        langSelector.value = lang;
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    const currentLang = getCurrentLanguage();
    updatePageContent(currentLang);

    const langSelector = document.getElementById('languageSelector');
    if (langSelector) {
        langSelector.addEventListener('change', function(e) {
            setLanguage(e.target.value);
        });
    }
});
