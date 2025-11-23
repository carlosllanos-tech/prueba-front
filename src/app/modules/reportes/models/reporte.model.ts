export interface TablaPosiciones {
    equipo_id: number;
    equipo_nombre: string;
    partidos_jugados: string;
    partidos_ganados: string;
    partidos_empatados: string;
    partidos_perdidos: string;
    goles_favor: string;
    goles_contra: string;
    diferencia_goles: string;
    puntos: string;
}

// Interface para respuesta de tabla de posiciones
export interface TablaPosicionesResponse {
    success: boolean;
    message: string;
    data: TablaPosiciones[];
    torneo: {
        id: number;
        nombre: string;
        disciplina: string;
    };
}

// Tipos de reportes disponibles
export const TIPOS_REPORTE = [
    { value: 'equipos', label: 'Equipos por Torneo', icon: '👥', descripcion: 'Lista de equipos participantes' },
    { value: 'jugadores', label: 'Jugadores por Equipo', icon: '⚽', descripcion: 'Nómina de jugadores' },
    { value: 'fixture', label: 'Fixture de Torneo', icon: '📅', descripcion: 'Calendario de partidos' },
    { value: 'tabla', label: 'Tabla de Posiciones', icon: '🏆', descripcion: 'Posiciones y estadísticas' }
];

// Formatos de exportación
export const FORMATOS_EXPORTACION = [
    { value: 'pdf', label: 'PDF', icon: '📄', color: '#dc3545' },
    { value: 'excel', label: 'Excel', icon: '📊', color: '#28a745' },
    { value: 'json', label: 'JSON', icon: '{}', color: '#0dcaf0' }
];