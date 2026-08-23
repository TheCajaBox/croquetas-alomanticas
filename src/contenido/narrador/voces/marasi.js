const LINEAS_DE_MARASI = {
  presentacion: [
    'Marasi Colms. Me interesa menos lo que sabes resolver que lo que recuerdas una semana después, así que he preparado unas preguntas sobre lo que ya has visto.',
  ],

  abreCaso: [
    'He revisado por dónde vas y he sacado las preguntas de lo que más se confunde. No es un examen: es para ver qué se ha quedado.',
    (contexto) =>
      `${contexto.cuantas} preguntas sobre lo que ya has hecho. Si fallas alguna, mejor: eso es exactamente lo que había que encontrar.`,
  ],

  bordado: [
    'Todas. Y sin dudar en ninguna, por lo que he visto. Eso se ha quedado.',
    'Pleno. Lo digo con conocimiento de causa: estas preguntas están puestas donde la gente falla.',
  ],

  bien: [
    'La mayoría. Lo que has fallado no es casualidad, así que vuelve al apunte de ese reto y léelo otra vez con calma.',
    'Bastante bien. Apunta lo que has fallado; son justo los sitios donde volverás a tropezar.',
  ],

  flojo: [
    'Menos de la mitad. No es un problema: significa que ese mundo hay que volver a leerlo, no que no valgas para esto.',
    'Ha ido flojo. Es información útil: ya sabes exactamente qué repasar, y eso vale más que un aprobado.',
  ],
}

export default LINEAS_DE_MARASI
