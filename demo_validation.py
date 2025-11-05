#!/usr/bin/env python3
"""
🧪 Script de démonstration automatisée - ShopTastrophe
Cours : Qualité Développement

Usage: python demo_validation.py
"""

import re
import sys
from colorama import Colorama, Fore, Style, init

# Initialiser colorama pour Windows
init()

class ValidationDemo:
    def __init__(self):
        self.tests_passed = 0
        self.tests_total = 0
        
    def print_header(self, title):
        print(f"\n{Fore.CYAN}{'='*60}{Style.RESET_ALL}")
        print(f"{Fore.CYAN}{title:^60}{Style.RESET_ALL}")
        print(f"{Fore.CYAN}{'='*60}{Style.RESET_ALL}")
        
    def print_test(self, test_name, expected, actual, details=""):
        self.tests_total += 1
        if expected == actual:
            self.tests_passed += 1
            status = f"{Fore.GREEN}✅ PASS{Style.RESET_ALL}"
        else:
            status = f"{Fore.RED}❌ FAIL{Style.RESET_ALL}"
            
        print(f"{status} {test_name}")
        if details:
            print(f"     {Fore.YELLOW}→ {details}{Style.RESET_ALL}")
        
    def validate_email(self, email):
        """Validation email identique à celle du frontend"""
        # Vérification du format général
        email_regex = r'^[^\s@]+@[^\s@]+\.[^\s@]+$'
        if not re.match(email_regex, email):
            return False, "Format email invalide"
        
        # Extensions valides
        valid_extensions = [
            'com', 'fr', 'org', 'net', 'edu', 'gov', 'mil', 'int',
            'eu', 'uk', 'de', 'it', 'es', 'ca', 'au', 'jp', 'cn',
            'info', 'biz', 'name', 'pro', 'coop', 'museum'
        ]
        
        parts = email.split('@')
        if len(parts) != 2:
            return False, "Format email invalide"
        
        domain = parts[1]
        domain_parts = domain.split('.')
        extension = domain_parts[-1].lower()
        
        if extension not in valid_extensions:
            return False, f"Extension '{extension}' non autorisée"
            
        return True, "Email valide"
    
    def validate_phone(self, phone):
        """Validation téléphone identique à celle du frontend"""
        # Format général
        phone_regex = r'^[\d\s\-\(\)\+]+$'
        if not re.match(phone_regex, phone):
            return False, "Caractères non autorisés"
        
        # Doit commencer par +33
        if not phone.strip().startswith('+33'):
            return False, "Doit commencer par +33"
        
        # Compter les chiffres après +33
        digits_after_33 = re.sub(r'[^\d]', '', phone.replace('+33', ''))
        if len(digits_after_33) > 9:
            return False, f"Trop de chiffres ({len(digits_after_33)}/9 max)"
            
        return True, "Téléphone valide"
    
    def demo_email_validation(self):
        """Démonstration de la validation email"""
        self.print_header("DÉMONSTRATION VALIDATION EMAIL")
        
        test_cases = [
            # (email, expected_valid, description)
            ("user@example.com", True, "Email standard valide"),
            ("contact@site.fr", True, "Extension française"),
            ("info@org.org", True, "Extension .org"),
            ("test@university.edu", True, "Extension éducation"),
            
            ("user@test.c", False, "Extension trop courte"),
            ("user@test", False, "Pas d'extension"),
            ("user@", False, "Pas de domaine"),
            ("@example.com", False, "Pas de nom utilisateur"),
            ("user.test.com", False, "Pas de @"),
            ("user@test.xyz", False, "Extension non reconnue"),
        ]
        
        for email, expected_valid, description in test_cases:
            is_valid, message = self.validate_email(email)
            self.print_test(
                f"Email: {email:<25}",
                expected_valid, 
                is_valid,
                f"{description} - {message}"
            )
    
    def demo_phone_validation(self):
        """Démonstration de la validation téléphone"""
        self.print_header("DÉMONSTRATION VALIDATION TÉLÉPHONE")
        
        test_cases = [
            # (phone, expected_valid, description)
            ("+33 1 23 45 67 89", True, "Format français standard"),
            ("+33 123456789", True, "9 chiffres exactement"),
            ("+33 6 12 34 56 78", True, "Mobile français"),
            ("+33 1-23-45-67-89", True, "Avec tirets"),
            ("+33 (1) 23 45 67 89", True, "Avec parenthèses"),
            
            ("01 23 45 67 89", False, "Sans préfixe +33"),
            ("+33 1234567890", False, "10 chiffres (trop)"),
            ("+44 123456789", False, "Préfixe britannique"),
            ("+33 abc123456", False, "Lettres interdites"),
            ("123456789", False, "Pas de préfixe"),
        ]
        
        for phone, expected_valid, description in test_cases:
            is_valid, message = self.validate_phone(phone)
            self.print_test(
                f"Téléphone: {phone:<20}",
                expected_valid, 
                is_valid,
                f"{description} - {message}"
            )
    
    def demo_edge_cases(self):
        """Démonstration des cas limites"""
        self.print_header("DÉMONSTRATION CAS LIMITES")
        
        print(f"{Fore.YELLOW}📧 Cas limites Email:{Style.RESET_ALL}")
        edge_emails = [
            "a@b.com",  # Email minimal valide
            "user+tag@example.com",  # Avec tag
            "user.name@example.com",  # Avec point
            "user@sub.domain.com",  # Sous-domaine
        ]
        
        for email in edge_emails:
            is_valid, message = self.validate_email(email)
            status = f"{Fore.GREEN}✅{Style.RESET_ALL}" if is_valid else f"{Fore.RED}❌{Style.RESET_ALL}"
            print(f"  {status} {email:<25} → {message}")
        
        print(f"\n{Fore.YELLOW}📱 Cas limites Téléphone:{Style.RESET_ALL}")
        edge_phones = [
            "+33 123456789",  # 9 chiffres exactement
            "+33 12345678",   # 8 chiffres (valide)
            "+33 1",          # 1 chiffre (valide)
            "+33",            # Juste le préfixe
        ]
        
        for phone in edge_phones:
            is_valid, message = self.validate_phone(phone)
            status = f"{Fore.GREEN}✅{Style.RESET_ALL}" if is_valid else f"{Fore.RED}❌{Style.RESET_ALL}"
            print(f"  {status} {phone:<20} → {message}")
    
    def show_summary(self):
        """Affichage du résumé des tests"""
        self.print_header("RÉSUMÉ DES TESTS")
        
        success_rate = (self.tests_passed / self.tests_total) * 100 if self.tests_total > 0 else 0
        
        print(f"Tests exécutés: {self.tests_total}")
        print(f"Tests réussis:  {Fore.GREEN}{self.tests_passed}{Style.RESET_ALL}")
        print(f"Tests échoués:  {Fore.RED}{self.tests_total - self.tests_passed}{Style.RESET_ALL}")
        print(f"Taux de réussite: {Fore.CYAN}{success_rate:.1f}%{Style.RESET_ALL}")
        
        if success_rate == 100:
            print(f"\n{Fore.GREEN}🎉 Tous les tests passent ! Validation implémentée correctement.{Style.RESET_ALL}")
        else:
            print(f"\n{Fore.YELLOW}⚠️  Certains tests échouent - vérifier l'implémentation.{Style.RESET_ALL}")

def main():
    """Fonction principale de démonstration"""
    print(f"{Fore.MAGENTA}")
    print("🧪 DÉMONSTRATION VALIDATION - SHOPTASTROPHE")
    print("Cours: Qualité Développement")
    print("Objectif: Montrer l'implémentation de validations robustes")
    print(f"{Style.RESET_ALL}")
    
    demo = ValidationDemo()
    
    try:
        demo.demo_email_validation()
        demo.demo_phone_validation()
        demo.demo_edge_cases()
        demo.show_summary()
        
        print(f"\n{Fore.CYAN}💡 Points démontrés:{Style.RESET_ALL}")
        print("  ✅ Validation côté client ET serveur")
        print("  ✅ Gestion des cas d'erreur")
        print("  ✅ Messages d'erreur explicites")
        print("  ✅ Tests automatisés documentés")
        print("  ✅ Couverture des cas limites")
        
    except KeyboardInterrupt:
        print(f"\n{Fore.YELLOW}⏸️  Démonstration interrompue par l'utilisateur{Style.RESET_ALL}")
    except Exception as e:
        print(f"\n{Fore.RED}💥 Erreur durant la démonstration: {e}{Style.RESET_ALL}")
        sys.exit(1)

if __name__ == "__main__":
    # Installer colorama si nécessaire
    try:
        import colorama
    except ImportError:
        print("📦 Installation de colorama...")
        import subprocess
        subprocess.check_call([sys.executable, "-m", "pip", "install", "colorama"])
        import colorama
        
    main()