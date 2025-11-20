// Interface para Jugador completo (con detalles)
export interface Jugador {
    id: number;
    nombre: string;
    apellido: string;
    fecha_nacimiento: string;
    nro_camiseta: number;
    posicion: string;
    equipo_id: number;
    equipo_nombre: string;
    equipo_color: string;
    torneo_id: number;
    torneo_nombre: string;
    torneo_disciplina: string;
    torneo_organizador_id?: number;
    creado_en: string;
    actualizado_en: string;
    edad?: number;
}

// Interface para Jugador en listados
export interface JugadorListado {
    id: number;
    nombre: string;
    apellido: string;
    fecha_nacimiento: string;
    nro_camiseta: number;
    posicion: string;
    equipo_id: number;
    equipo_nombre: string;
    equipo_color: string;
    torneo_id: number;
    torneo_nombre: string;
    torneo_disciplina: string;
    creado_en: string;
    actualizado_en: string;
}

// Interface para crear/actualizar jugador
export interface JugadorForm {
    nombre: string;
    apellido: string;
    fecha_nacimiento: string;
    nro_camiseta: number;
    posicion: string;
    equipo_id?: number; // Opcional en actualización
}

// Interface para respuesta de petición
export interface JugadorResponse {
    id: number;
    nombre: string;
    apellido: string;
    fecha_nacimiento: Date;
    nro_camiseta: number;
    posicion: string;
    equipo_id: number;
    creado_en?: Date;
    actualizado_en?: Date;
}