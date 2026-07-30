import React from 'react';
import LegalPage from '../components/LegalPage';

// Keep in sync with PRIVACY.md (the hosted copy the app stores require).
const SECTIONS = [
  {
    title: 'Qué se guarda',
    body:
      'Tu nombre, tus tareas (título, notas, duración, urgencia y día de entrega), tu ritmo de estudio, tus puntos y los días en que completaste tareas.',
  },
  {
    title: 'Dónde se guarda',
    body:
      'Solo en el almacenamiento local de tu dispositivo. Focal no tiene servidores y no realiza ninguna conexión a internet.',
  },
  {
    title: 'Qué no hacemos',
    body:
      'No recopilamos datos personales. No usamos analítica, publicidad ni rastreadores. No compartimos ni vendemos información. No pedimos correo, teléfono ni contraseña. No solicitamos permisos del sistema.',
  },
  {
    title: 'Menores de edad',
    body:
      'La app está dirigida a estudiantes. Como no se recopila ni transmite información personal, no se obtienen datos de menores en ningún momento.',
  },
  {
    title: 'Tus derechos (GDPR / CCPA)',
    body:
      'Al ser todo local, tienes control total. Puedes eliminar tus datos desde Ajustes → «Borrar todos mis datos», o desinstalando la app.',
  },
  {
    title: 'Contacto',
    body: 'Escríbenos desde la ficha de la aplicación en la tienda.',
  },
];

export default function PrivacyScreen({ navigation }) {
  return (
    <LegalPage
      title="Privacidad"
      updated="27 de julio de 2026"
      highlight="Tus datos nunca salen de tu dispositivo."
      sections={SECTIONS}
      onBack={() => navigation.goBack()}
    />
  );
}
