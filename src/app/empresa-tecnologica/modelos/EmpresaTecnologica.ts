//agregar el modelo con ua interfaz
export interface EmpresaTecnologica {
    idEmpresa: string;
    nombre: string;
    idVigilado: number;
    token: string;
    estado: boolean;
    fechaInicialMostrar: string;
    fechaFinalMostrar: string
    fechaInicial: string;
    fechaFinal: string;
}