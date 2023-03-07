import type { NextApiRequest, NextApiResponse } from "next";
import connectionPool from "../../../../config/db";

type ErrorData = {
  body: string;
};

export default async function handlerAddDatos(
  req: NextApiRequest,
  res: NextApiResponse<ErrorData>
) {
  if (req.method !== "POST") {
    res.status(405).json({ body: "Method Not Allowed" });
    return;
  }

  try {
    const { NombreCompetencia, Abreviatura, TipoCompetencia, IdSubSede } =
      req.body;

    console.log(req.body);

    const [verificarExistencia]: any = await connectionPool.query(
      `SELECT * FROM pfc_ejes where eje_nom='${NombreCompetencia}' and subSedeId='${IdSubSede}'`
    );

    if (verificarExistencia.length) {
      res.status(400).json({ body: "Esta competencia ya existe" });
      return;
    }

    const [Maxcodigo]: any = await connectionPool.query(
      `SELECT MAX(eje_cod) as codigo FROM pfc_ejes`
    );
    let codigo = "";
    if (Maxcodigo[0]?.codigo > 9 && Maxcodigo[0]?.codigo) {
      codigo = `0${parseInt(Maxcodigo[0]?.codigo) + 1}`;
    } else if (Maxcodigo[0]?.codigo) {
      codigo = `${parseInt(Maxcodigo[0]?.codigo) + 1}`;
    }
    const [addPrograma]: any = await connectionPool.query(`
    INSERT INTO pfc_ejes (eje_cod, eje_nom, eje_abr,eje_tip,subSedeId) VALUES ('${
      codigo || "01"
    }', '${NombreCompetencia}', '${Abreviatura}','${TipoCompetencia}','${IdSubSede}')`);

    res.status(200).json({ body: "Competencia agregada con éxito" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ body: "Internal Server Error" });
  }
}
