export type Level = "low" | "medium" | "high" | "very-high";

export interface ServiceItem {
  title: string;
  description: string;
  example: string;
  necessity: { level: Level; value: number };
  technicity: { level: Level; value: number };
  cost: { level: Level; value: number };
  icon: string;
}

const ICONS = {
  globe: `<circle cx="12" cy="12" r="10"/><path d="M2 12h20"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>`,
  desktop: `<rect width="20" height="14" x="2" y="3" rx="2"/><line x1="8" x2="16" y1="21" y2="21"/><line x1="12" x2="12" y1="17" y2="21"/>`,
  network: `<rect x="2" y="14" width="6" height="6" rx="1"/><rect x="16" y="14" width="6" height="6" rx="1"/><rect x="9" y="2" width="6" height="6" rx="1"/><path d="M5 14V8h14v6"/><path d="M12 8v6"/>`,
  search: `<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>`,
  target: `<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>`,
  mobile: `<rect x="5" y="2" width="14" height="20" rx="2"/><path d="M12 18h.01"/>`,
  briefcase: `<path d="M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/><rect width="20" height="14" x="2" y="6" rx="2"/>`,
  trophy: `<path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/>`,
};

export const auditServices: ServiceItem[] = [
  {
    title: "Test d'intrusion web",
    icon: ICONS.globe,
    description:
      "Le test d'intrusion web consiste à évaluer la sécurité d'une application web. Réalisable sans compte (boîte noire), avec des comptes (boîte grise) et en possession du code source (boîte blanche). La prestation en boîte blanche est à privilégier et garantit une plus grande exhaustivité.",
    example: "compromission d'une application métier sensible accessible d'internet.",
    necessity: { level: "high", value: 80 },
    technicity: { level: "high", value: 70 },
    cost: { level: "low", value: 40 },
  },
  {
    title: "Audit client lourd",
    icon: ICONS.desktop,
    description:
      "Le test d'intrusion sur un logiciel client lourd permet d'étudier la sécurité de cette solution. Souvent couplée avec un service web, l'audit comprend l'analyse du logiciel et de son environnement de fonctionnement.",
    example: "compromission du système de paye par un collaborateur malveillant.",
    necessity: { level: "high", value: 70 },
    technicity: { level: "high", value: 70 },
    cost: { level: "low", value: 40 },
  },
  {
    title: "Évaluation d'infrastructure",
    icon: ICONS.network,
    description:
      "L'évaluation d'infrastructure consiste à étudier la sécurité de l'ensemble des services exposés publiquement d'un ou plusieurs hôtes. Très fréquemment incluse dans un audit web, cette prestation est à privilégier pour l'étude de larges périmètres.",
    example:
      "compromission d'un serveur de fichiers de l'entreprise accessible publiquement.",
    necessity: { level: "medium", value: 50 },
    technicity: { level: "medium", value: 50 },
    cost: { level: "low", value: 30 },
  },
  {
    title: "Découverte de périmètre",
    icon: ICONS.search,
    description:
      "La découverte de périmètre consiste à cartographier le périmètre numérique d'une cible. Elle consiste à collecter des informations publiques pouvant être utiles à un attaquant. Conseillée pour les grosses structures.",
    example:
      "prise de contrôle de sous-domaine sensible et dégradation de l'image de marque.",
    necessity: { level: "medium", value: 40 },
    technicity: { level: "low", value: 30 },
    cost: { level: "low", value: 20 },
  },
  {
    title: "Test d'intrusion interne",
    icon: ICONS.target,
    description:
      "Le test d'intrusion interne permet d'évaluer le niveau de sécurité interne d'un système d'information. Vérification de l'architecture réseau, gestion des actifs, configuration des postes de travail et de l'Active Directory.",
    example:
      "scénario de compromission de la totalité du système d'information par rançongiciel.",
    necessity: { level: "very-high", value: 90 },
    technicity: { level: "very-high", value: 90 },
    cost: { level: "high", value: 70 },
  },
  {
    title: "Test d'intrusion mobile",
    icon: ICONS.mobile,
    description:
      "Le test d'intrusion mobile consiste à évaluer la sécurité d'une application mobile. À travers un ensemble de tests, l'audit étudie les communications de l'application ainsi que son mode de fonctionnement.",
    example:
      "compromission de données sensibles stockées de façon non sécurisée par l'application.",
    necessity: { level: "medium", value: 40 },
    technicity: { level: "high", value: 70 },
    cost: { level: "low", value: 40 },
  },
];

export const trainingServices: ServiceItem[] = [
  {
    title: "Formation à la sécurité offensive",
    icon: ICONS.briefcase,
    description:
      "Trackflaw dispense diverses formations en sécurité offensive en milieu professionnel comme en centre de formations privé. Du développement sécurisé aux méthodes d'intrusion les plus avancées, les cours sont conçus sur demande et orientés pratique à travers des exercices inspirés de cas réels.",
    example: "formation au développement web sécurisé.",
    necessity: { level: "high", value: 70 },
    technicity: { level: "low", value: 30 },
    cost: { level: "low", value: 40 },
  },
  {
    title: "Préparation aux certifications offensives",
    icon: ICONS.trophy,
    description:
      "Trackflaw encadre les nouveaux talents en sécurité offensive à travers des cours de préparation aux grandes certifications du marché : OSCP, eCPPT, ECSA, etc. Entraînement intensif dans des laboratoires semblables à ceux des examens. Un niveau technique important est requis.",
    example: "préparation à la certification OSCP.",
    necessity: { level: "medium", value: 40 },
    technicity: { level: "high", value: 80 },
    cost: { level: "low", value: 40 },
  },
];
