export interface FaqEntry {
  question: string;
  answer: string;
}

export const faq: FaqEntry[] = [
  {
    question: "Comment protéger mes données clients confidentielles ?",
    answer: `Il existe de nombreuses solutions.<br><br>
Une des solutions est d'effectuer des tests d'intrusion en utilisant des méthodes de boîte grise et de boîte blanche, afin de simuler de la façon la plus réaliste possible des attaques par des pirates informatiques.<br><br>
<a href="https://blog.trackflaw.com/quelle-d%C3%A9marche-test-intrusion/" class="text-brand-soft hover:text-brand">Plus d'informations sur le choix de votre démarche d'audit sur notre blog.</a><br><br>
Ces <a href="/services#audit" class="text-brand-soft hover:text-brand">audits</a> vous permettent d'appréhender le niveau de résistance de votre système d'information face à des tentatives d'intrusion réelles et sophistiquées.`,
  },
  {
    question:
      "Comment savoir que mon entreprise ne s'est pas faite pirater ? Et comment l'éviter ?",
    answer: `Malheureusement, il n'existe pas de solution miracle.<br><br>
Dans un premier temps, Trackflaw peut intervenir afin de procéder à des levées de doutes sur les environnements de votre choix. Cette analyse permet de vérifier en détail l'état de santé de la cible et de conclure sur l'état d'une potentielle compromission. <a href="/services#réponse-à-incident" class="text-brand-soft hover:text-brand">Plus d'informations sur notre page de service.</a><br><br>
Pour éviter que votre entreprise se fasse pirater, il est conseillé d'effectuer régulièrement des audits, des tests d'intrusion, de renforcer vos systèmes de filtrage (pare-feu) et d'installer des systèmes de détection d'intrusion.<br><br>
Enfin, il est conseillé de sensibiliser ses employés sur la sécurité des systèmes d'information à travers des ateliers ludiques (phishing, clé USB), et de maintenir à jour ses applications.<br><br>
En bref, une tâche difficile, exigeante et coûteuse. Mais pas de panique, <a href="/services#audit" class="text-brand-soft hover:text-brand">Trackflaw est là pour vous aider.</a>`,
  },
  {
    question: "Je ne suis pas à l'aise avec la sécurité, comment me former ?",
    answer: `Pour vous former en sécurité informatique, il est conseillé de commencer par des cours en ligne axés sur les fondamentaux. Recherchez des formations couvrant la détection des vulnérabilités, les audits de sécurité, et la gestion des incidents proposés par les plateformes Root-Me, HackTheBox, OpenClassroom ou TryHackMe.<br><br>
Il est aussi très conseillé de réaliser une veille fréquente via les réseaux sociaux et de participer à des salons et webinaires afin de développer vos compétences en cybersécurité.<br><br>
Trackflaw vous accompagne dans cette démarche à travers <a href="/services#formations" class="text-brand-soft hover:text-brand">nos plans de formations sur mesure</a>.`,
  },
  {
    question:
      "Pouvez-vous m'accompagner dans l'obtention d'une assurance Cyber ?",
    answer: `Oui tout à fait.<br><br>
De nombreux clients prennent contact avec nous pour réunir toutes les exigences nécessaires afin d'obtenir un avis favorable pour souscrire à une assurance cyber. Quel que soit votre assureur, nous sommes compétents pour vous accompagner à obtenir les prérequis nécessaires à travers des exercices d'audit, d'analyse et de remédiation.<br><br>
<a href="/commande" class="text-brand-soft hover:text-brand">Prenez contact avec nous.</a>`,
  },
];
