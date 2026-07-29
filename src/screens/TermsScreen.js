import React from 'react';
import LegalPage from '../components/LegalPage';

const SECTIONS = [
  {
    title: 'Uso de la aplicación',
    body:
      'Focal es una herramienta gratuita de organización académica. Puedes usarla libremente de forma personal y no comercial.',
  },
  {
    title: 'Tu contenido',
    body:
      'Las tareas y notas que creas te pertenecen y se guardan solo en tu dispositivo. Eres responsable de la información que introduces.',
  },
  {
    title: 'Sin garantías',
    body:
      'La app se ofrece «tal cual». Es una ayuda para organizarte, no un sustituto de tus obligaciones académicas. No garantizamos que esté libre de errores.',
  },
  {
    title: 'Copias de seguridad',
    body:
      'Como los datos se guardan solo en tu dispositivo, se perderán si desinstalas la app o borras sus datos. Anota lo importante en otro lugar.',
  },
  {
    title: 'Cambios',
    body:
      'Podemos actualizar estos términos en futuras versiones. El uso continuado implica la aceptación de la versión vigente.',
  },
];

export default function TermsScreen({ navigation }) {
  return (
    <LegalPage
      title="Términos"
      updated="27 de julio de 2026"
      sections={SECTIONS}
      onBack={() => navigation.goBack()}
    />
  );
}
