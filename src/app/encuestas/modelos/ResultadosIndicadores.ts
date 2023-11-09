export interface ResultadosIndicadores {
    indicadores: Indicador[];
}

export interface Indicador {
    id:           number;
    nombre:       string;
    periodicidad: string;
    filas:        Fila[];
}

export interface Fila {
    columas: Columa[];
}

export interface Columa {
    valor: string;
    span:  number;
}
