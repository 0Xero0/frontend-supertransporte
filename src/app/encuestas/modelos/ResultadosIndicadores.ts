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
    columnas: Columna[];
}

export interface Columna {
    valor: string;
    span:  number;
}
