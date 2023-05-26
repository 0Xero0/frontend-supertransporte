export interface Encuesta {
    tipoAccion:      number;
    clasificaciones: Clasificacion[];
}

export interface Clasificacion {
    clasificacion: string;
    preguntas:     Pregunta[];
}

export interface Pregunta {
    idPregunta:            number;
    numeroPregunta:        number;
    tipoPregunta:          string;
    valoresPregunta:       ValoresPregunta[];
    pregunta:              string;
    obligatoria:           boolean;
    respuesta:             string | undefined | null;
    tipoDeEvidencia:       string;
    documento:             string;
    adjuntable:            boolean;
    adjuntableObligatorio: boolean;
    validaciones:          Validacion[];
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