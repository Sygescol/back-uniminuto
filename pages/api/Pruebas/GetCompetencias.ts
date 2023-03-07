import type { NextApiRequest, NextApiResponse } from "next";
import connectionPool from "../../../config/db";

type Data = {
  competencias: [];
};

type ErrorData = {
  body: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data | ErrorData>
) {
  if (req.method !== "POST") {
    res.status(405).json({ body: "Method Not Allowed" });
    return;
  }
  try {
    const { Values } = req.body;

    console.log("xd", req.body);

    let competencias = {};

    if (Values?.TipoPrueba == "SP" && Values?.IdRol == "2") {
      const [competenciasRes]: any = await connectionPool.query(`
      SELECT asignacionPrueba.id as Id,pfc_ejes.eje_tip as Tipo,pfc_ejes.eje_nom as Nombre, asignacionPrueba.competencia AS idCompetencia FROM asignacionPrueba INNER JOIN parametros_pruebas ON (asignacionPrueba.prueba=parametros_pruebas.id) INNER JOIN pfc_ejes on (asignacionPrueba.competencia=pfc_ejes.eje_id) WHERE parametros_pruebas.id = '${Values?.PruebasId}' AND parametros_pruebas.tipo ='${Values?.TipoPrueba}' AND parametros_pruebas.programa='${Values?.IdPrograma}' AND parametros_pruebas.semestre = '${Values?.Semestre}' AND parametros_pruebas.subSedeId ='${Values?.CoaId}' AND asignacionPrueba.docente = '${Values?.IdUser}' 
      `);

      const competenciaFormated = [{}];
      for (const competencia of competenciasRes) {
        const [preguntas]: any = await connectionPool.query(
          `SELECT * FROM preguntas_pruebas WHERE competencia = ${competencia?.idCompetencia} AND prueba = ${Values.PruebasId} AND tipo != 100`
        );
        console.log(``);
        competenciaFormated.push({
          ...competencia,
          cantidad: preguntas.length,
          preguntas: preguntas,
        });
      }
      competencias = competenciaFormated?.reduce((acc: any, item: any) => {
        let key = item.Tipo;
        if (!acc[key]) {
          acc[key] = [];
        }
        acc[key].push(item);
        return acc;
      }, {});
    } else {
      const [competenciasRes]: any = await connectionPool.query(`
      SELECT asignacionPrueba.id as Id,pfc_ejes.eje_tip as Tipo,pfc_ejes.eje_nom as Nombre FROM asignacionPrueba INNER JOIN parametros_pruebas ON (asignacionPrueba.prueba=parametros_pruebas.id) INNER JOIN pfc_ejes on (asignacionPrueba.competencia=pfc_ejes.eje_id) WHERE parametros_pruebas.id = '${Values?.Prueba}' AND parametros_pruebas.tipo='${Values?.TipoPrueba}' AND parametros_pruebas.programa='${Values?.Programa}' AND parametros_pruebas.semestre='${Values.Semestre}'
      `);

      competencias = competenciasRes?.reduce((acc: any, item: any) => {
        let key = item.Tipo;
        if (!acc[key]) {
          acc[key] = [];
        }
        acc[key].push(item);
        return acc;
      }, {});
    }

    res.status(200).json({ competencias: competencias } as Data);
  } catch (error) {
    console.log(error);
    res.status(500).json({ body: "Internal server error" } as ErrorData);
  }
}
