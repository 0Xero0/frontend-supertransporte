export interface Encuesta {
    tipoAccion:      number;
    observacion:     boolean;
    encuestaEditable: boolean
    verificacionVisible: boolean
    verificacionEditable: boolean
    clasificaion:   string;
    descripcionClasificacion: string;
    nombreEncuesta: string;
    idVigilado: string;
    idEncuesta: string;
    razonSocila: string
    estadoActual: string
    clasificaciones: Clasificacion[];
}

export interface Clasificacion {
    clasificacion: string;
    preguntas:     Pregunta[];
}

export interface Pregunta {
    idPregunta:             number;
    numeroPregunta:         number;
    tipoPregunta:           string;
    valoresPregunta:        ValoresPregunta[];
    pregunta:               string;
    obligatoria:            boolean;
    respuesta:              string | undefined | null;
    tipoDeEvidencia:        string;
    documento:              string;
    nombreOriginal:         string;
    ruta:                   string;
    cumple:                 string | number | null;
    observacionCumple:      string;
    observacion:            string;
    corresponde:            string | number | null;
    observacionCorresponde: string
    adjuntable:             boolean;
    adjuntableObligatorio:  boolean;
    validaciones:           Validacion[];
    tamanio: number
}

export interface Validacion {
    validacion: string;
    max:        number | null | undefined;
    min:        number | null | undefined;
}

export interface ValoresPregunta {
    clave: string;
    valor: string;
}