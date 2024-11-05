import { ResultadosIndicadores } from "../modelos/ResultadosIndicadores";

/* export const ResultadosIndicadoresMock: ResultadosIndicadores = {
    "indicadores": [{
        "id": 1,
        "nombre": "Tasa de siniestros viales por nivel de pérdida",
        "periodicidad": "trimestral",
        "filas": [{
            "columas": [{
                "valor": "2,3",
                "span": 3
            }, {
                "valor": "3",
                "span": 3
            }, {
                "valor": "4",
                "span": 3
            }, {
                "valor": "Sin información",
                "span": 3
            }]
        }, {
            "columas": [{
                "valor": "3",
                "span": 3
            }, {
                "valor": "2",
                "span": 3
            }, {
                "valor": "Sin información",
                "span": 3
            }, {
                "valor": "2",
                "span": 3
            }]
        }, {
            "columas": [{
                "valor": "4",
                "span": 3
            }, {
                "valor": "1",
                "span": 3
            }, {
                "valor": "4",
                "span": 3
            }, {
                "valor": "0",
                "span": 3
            }]
        }, {
            "columas": [{
                "valor": "7",
                "span": 3
            }, {
                "valor": "6",
                "span": 3
            }, {
                "valor": "5",
                "span": 3
            }, {
                "valor": "0",
                "span": 3
            }]
        }]
    }, {
        "id": 2,
        "nombre": "Costos siniestros viales por nivel de pérdida",
        "periodicidad": "trimestral",
        "filas": [{
            "columas": [{
                "valor": "2,3",
                "span": 3
            }, {
                "valor": "3",
                "span": 3
            }, {
                "valor": "4",
                "span": 3
            }, {
                "valor": "Sin información",
                "span": 3
            }]
        }, {
            "columas": [{
                "valor": "3",
                "span": 3
            }, {
                "valor": "2",
                "span": 3
            }, {
                "valor": "Sin información",
                "span": 3
            }, {
                "valor": "2",
                "span": 3
            }]
        }, {
            "columas": [{
                "valor": "4",
                "span": 3
            }, {
                "valor": "1",
                "span": 3
            }, {
                "valor": "4",
                "span": 3
            }, {
                "valor": "0",
                "span": 3
            }]
        }, {
            "columas": [{
                "valor": "7",
                "span": 3
            }, {
                "valor": "6",
                "span": 3
            }, {
                "valor": "5",
                "span": 3
            }, {
                "valor": "0",
                "span": 3
            }]
        }]
    }, {
        "id": 3,
        "nombre": "Riesgos de seguridad vial",
        "periodicidad": "anual",
        "filas": [{
            "columas": [{
                "valor": "8.3",
                "span": 12
            }]
        }, {
            "columas": [{
                "valor": "0",
                "span": 12
            }]
        }]
    }, {
        "id": 4,
        "nombre": "Cumplimiento de metas del PESV",
        "periodicidad": "trimestral",
        "filas": [{
            "columas": [{
                "valor": "7",
                "span": 3
            }, {
                "valor": "6",
                "span": 3
            }, {
                "valor": "5",
                "span": 3
            }, {
                "valor": "0",
                "span": 3
            }]
        }]
    }, {
        "id": 5,
        "nombre": "Cumplimiento de actividades plan anual",
        "periodicidad": "trimestral",
        "filas": [{
            "columas": [{
                "valor": "7",
                "span": 3
            }, {
                "valor": "6",
                "span": 3
            }, {
                "valor": "5",
                "span": 3
            }, {
                "valor": "0",
                "span": 3
            }]
        }]
    }, {
        "id": 6,
        "nombre": "% Exceso de jornadas laborales",
        "periodicidad": "mensual",
        "filas": [{
            "columas": [{
                "valor": "0",
                "span": 1
            }, {
                "valor": "2",
                "span": 1
            }, {
                "valor": "0",
                "span": 1
            }, {
                "valor": "3",
                "span": 1
            }, {
                "valor": "2",
                "span": 1
            }, {
                "valor": "5",
                "span": 1
            }, {
                "valor": "3.4",
                "span": 1
            }, {
                "valor": "0",
                "span": 1
            }, {
                "valor": "9",
                "span": 1
            }, {
                "valor": "8",
                "span": 1
            }, {
                "valor": "0",
                "span": 1
            }, {
                "valor": "0",
                "span": 1
            }]
        }]
    }, {
        "id": 7,
        "nombre": "Cobertura programa de gestión velocidad",
        "periodicidad": "mensual",
        "filas": [{
            "columas": [{
                "valor": "0",
                "span": 1
            }, {
                "valor": "2",
                "span": 1
            }, {
                "valor": "0",
                "span": 1
            }, {
                "valor": "3",
                "span": 1
            }, {
                "valor": "2",
                "span": 1
            }, {
                "valor": "5",
                "span": 1
            }, {
                "valor": "3.4",
                "span": 1
            }, {
                "valor": "0",
                "span": 1
            }, {
                "valor": "9",
                "span": 1
            }, {
                "valor": "8",
                "span": 1
            }, {
                "valor": "0",
                "span": 1
            }, {
                "valor": "0",
                "span": 1
            }]
        }, {
            "columas": [{
                "valor": "0",
                "span": 1
            }, {
                "valor": "2",
                "span": 1
            }, {
                "valor": "0",
                "span": 1
            }, {
                "valor": "3",
                "span": 1
            }, {
                "valor": "2",
                "span": 1
            }, {
                "valor": "5",
                "span": 1
            }, {
                "valor": "3.4",
                "span": 1
            }, {
                "valor": "0",
                "span": 1
            }, {
                "valor": "9",
                "span": 1
            }, {
                "valor": "8",
                "span": 1
            }, {
                "valor": "0",
                "span": 1
            }, {
                "valor": "0",
                "span": 1
            }]
        }, {
            "columas": [{
                "valor": "0",
                "span": 1
            }, {
                "valor": "2",
                "span": 1
            }, {
                "valor": "0",
                "span": 1
            }, {
                "valor": "3",
                "span": 1
            }, {
                "valor": "2",
                "span": 1
            }, {
                "valor": "5",
                "span": 1
            }, {
                "valor": "3.4",
                "span": 1
            }, {
                "valor": "0",
                "span": 1
            }, {
                "valor": "9",
                "span": 1
            }, {
                "valor": "8",
                "span": 1
            }, {
                "valor": "0",
                "span": 1
            }, {
                "valor": "0",
                "span": 1
            }]
        }]
    }, {
        "id": 8,
        "nombre": "Exceso Límite de velocidad laboral",
        "periodicidad": "mensual",
        "filas": [{
            "columas": [{
                "valor": "0",
                "span": 1
            }, {
                "valor": "2",
                "span": 1
            }, {
                "valor": "0",
                "span": 1
            }, {
                "valor": "3",
                "span": 1
            }, {
                "valor": "2",
                "span": 1
            }, {
                "valor": "5",
                "span": 1
            }, {
                "valor": "3.4",
                "span": 1
            }, {
                "valor": "0",
                "span": 1
            }, {
                "valor": "9",
                "span": 1
            }, {
                "valor": "8",
                "span": 1
            }, {
                "valor": "0",
                "span": 1
            }, {
                "valor": "0",
                "span": 1
            }]
        }]
    }, {
        "id": 9,
        "nombre": "Inspecciones diarias preoperacionales",
        "periodicidad": "mensual",
        "filas": [{
            "columas": [{
                "valor": "0",
                "span": 1
            }, {
                "valor": "2",
                "span": 1
            }, {
                "valor": "0",
                "span": 1
            }, {
                "valor": "3",
                "span": 1
            }, {
                "valor": "2",
                "span": 1
            }, {
                "valor": "5",
                "span": 1
            }, {
                "valor": "3.4",
                "span": 1
            }, {
                "valor": "0",
                "span": 1
            }, {
                "valor": "9",
                "span": 1
            }, {
                "valor": "8",
                "span": 1
            }, {
                "valor": "0",
                "span": 1
            }, {
                "valor": "0",
                "span": 1
            }]
        }]
    }, {
        "id": 10,
        "nombre": "Cumplimiento plan de mantenimiento preventivo de vehículos",
        "periodicidad": "trimestral",
        "filas": [{
            "columas": [{
                "valor": "7",
                "span": 3
            }, {
                "valor": "6",
                "span": 3
            }, {
                "valor": "5",
                "span": 3
            }, {
                "valor": "0",
                "span": 3
            }]
        }]
    }, {
        "id": 11,
        "nombre": "Cumplimiento plan de formación en seguridad vial CPF PESV",
        "periodicidad": "trimestral",
        "filas": [{
            "columas": [{
                "valor": "7",
                "span": 3
            }, {
                "valor": "6",
                "span": 3
            }, {
                "valor": "5",
                "span": 3
            }, {
                "valor": "0",
                "span": 3
            }]
        }]
    }, {
        "id": 12,
        "nombre": "Cobertura plan de formación en seguridad vial CPF PESV",
        "periodicidad": "trimestral",
        "filas": [{
            "columas": [{
                "valor": "7",
                "span": 3
            }, {
                "valor": "6",
                "span": 3
            }, {
                "valor": "5",
                "span": 3
            }, {
                "valor": "0",
                "span": 3
            }]
        }]
    }, {
        "id": 13,
        "nombre": "Nro. conformidades auditorias cerradas NCAC",
        "periodicidad": "anual",
        "filas": [{
            "columas": [{
                "valor": "8.3",
                "span": 12
            }]
        }]
    }]
} */
