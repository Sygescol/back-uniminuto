import { NextApiRequest, NextApiResponse } from "next";
import connectionPool from "../../../../../config/db";
type Data = {
  id: string;
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
    const { data, num } = req.body;
    // console.log(data);
    // console.log("==============SQL");
    // console.log(`UPDATE inscripciones SET depa_exp_id = '${
    //   data?.MunExpedicion?.departamento_id || ""
    // }', muni_exp_id = '${
    //   data?.MunExpedicion?.municipio_id || ""
    // }', exp_otro_pais = '${data.OtroPais}' ,alumno_fec_nac = '${
    //   data?.DateNacimiento?.substring(0, 10) || ""
    // }', alumno_fec_exp = '${
    //   data?.DateExpedicion?.substring(0, 10) || ""
    // }', muni_nac_id = '${
    //   data?.MunNacimiento?.municipio_id || ""
    // }', otro_pais_nac = '${
    //   data?.OtroPais || ""
    // }', est_nac = '' ,alumno_genero = '${data?.Genero?.id || ""}', rh_id = '${
    //   data?.Rh?.id || ""
    // }', sisben_id = '${data?.SisbenPuntaje || ""}',sin_sisben = '${
    //   data?.SisbenPuntaje ? "1" : "0"
    // }', sisben_mun_exp_id = '${
    //   data?.MunicipioExpSisben?.municipio_id || ""
    // }' ,eps_id = '${data?.Eps?.id || ""}',
    // ', alumno_hmcf = '${
    //   data?.HijoMadreCabeza || ""
    // }' WHERE num_docu_alumn = ${num}`);

    const [envio] = await connectionPool.query(
      `UPDATE inscripciones SET depa_exp_id = '${
        data?.MunExpedicion?.departamento_id || ""
      }', muni_exp_id = '${
        data?.MunExpedicion?.municipio_id || ""
      }', exp_otro_pais = '${data.OtroPais}' ,alumno_fec_nac = '${
        data?.DateNacimiento?.substring(0, 10) || ""
      }', alumno_fec_exp = '${
        data?.DateExpedicion?.substring(0, 10) || ""
      }', muni_nac_id = '${
        data?.MunNacimiento?.municipio_id || ""
      }', otro_pais_nac = '${
        data?.OtroPais || ""
      }', est_nac = '' ,alumno_genero = '${data?.Genero?.id || ""}', rh_id = '${
        data?.Rh?.id || ""
      }', sisben_id = '${data?.SisbenPuntaje || ""}',sin_sisben = '${
        data?.SisbenPuntaje ? "1" : "0"
      }', sisben_mun_exp_id = '${
        data?.MunicipioExpSisben?.municipio_id || ""
      }' ,eps_id = '${data?.Eps?.id || ""}', alumno_hmcf = '${
        data?.HijoMadreCabeza || ""
      }' WHERE alumno_num_docu = ${num}`
    );
    const [guarda]: any = await connectionPool.query(`
        SELECT id FROM guardar_seccion_formulario WHERE alumno_num_docu = '${num}' AND seccion_guardada = 'INFORMACION DEL ESTUDIANTE'
        `);
    if (!guarda.length) {
      const [ingresa] = await connectionPool.query(
        `INSERT INTO guardar_seccion_formulario(alumno_num_docu,guardado,seccion_guardada) VALUES('${num}',1,'INFORMACION DEL ESTUDIANTE')`
      );
    }
    res.status(200).json({ body: "Información Cargada Con Exitó" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ body: "Internal server error" } as ErrorData);
  }
}
