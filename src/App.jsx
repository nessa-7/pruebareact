import { useRef, useState } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import SignatureCanvas from "react-signature-canvas";
import "./App.css";

function App() {
  const pdfRef = useRef();

  const firmaEntregaRef = useRef();
  const firmaRecibeRef = useRef();
  const firmaAutorizaRef = useRef();

  const [firmaImagen, setFirmaImagen] =
  useState({
    autorizado: null,
    entrega: null,
    recibe: null,
  });
  

  const [form, setForm] = useState({
    fecha: "",
    regional: "POPAYAN",
    area: "ADMINISTRATIVA",
    puntoVenta: "POPAYAN",
    tipo: "Ingreso",

    recibe: "",
    ccRecibe: "",

    entrega: "",
    ccEntrega: "",

    autorizado: "",
    ccAutoriza: "",

    observaciones: "",
  });

  const [activos, setActivos] = useState([
    {
      codigo: "",
      serie: "",
      marca: "",
      descripcion: "",
      estado: "Bueno",
      observacion: "",
    },
  ]);

  const [firmas, setFirmas] = useState({
    autorizado: null,
    entrega: null,
    recibe: null,
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleActivoChange = (index, field, value) => {
    const nuevos = [...activos];
    nuevos[index][field] = value;
    setActivos(nuevos);
  };

  const agregarFila = () => {
    setActivos([
      ...activos,
      {
        codigo: "",
        serie: "",
        marca: "",
        descripcion: "",
        estado: "Bueno",
        observacion: "",
      },
    ]);
  };

  const eliminarFila = (index) => {
    const nuevos = activos.filter((_, i) => i !== index);
    setActivos(nuevos);
  };
  

  const subirFirma = (e, tipo) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onloadend = () => {
      setFirmas((prev) => ({
        ...prev,
        [tipo]: reader.result,
      }));
    };

    reader.readAsDataURL(file);
  };

  const descargarPDF = async () => {
  const input = pdfRef.current;

  const botones = document.querySelectorAll(
    ".floating-delete"
  );

  botones.forEach(
    (btn) => (btn.style.display = "none")
  );

  const canvas = await html2canvas(input, {
    scale: 2,
    useCORS: true,
  });

  botones.forEach(
    (btn) => (btn.style.display = "flex")
  );

  const imgData =
    canvas.toDataURL("image/png");

  const pdf = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "letter",
  });

  const pdfWidth = 216;
  const pdfHeight = 279;

  const imgWidth = pdfWidth;

  const imgHeight =
    (canvas.height * imgWidth) /
    canvas.width;

  let heightLeft = imgHeight;
  let position = 0;

  pdf.addImage(
    imgData,
    "PNG",
    0,
    position,
    imgWidth,
    imgHeight
  );

  heightLeft -= pdfHeight;

  while (heightLeft > 0) {
    position =
      heightLeft - imgHeight;

    pdf.addPage();

    pdf.addImage(
      imgData,
      "PNG",
      0,
      position,
      imgWidth,
      imgHeight
    );

    heightLeft -= pdfHeight;
  }

  pdf.save("acta_activos.pdf");
};


  return (
    <div className="container">
      <div className="panel-form">
        <h2>Formulario</h2>

        <label>Fecha</label>
        <input
          type="date"
          name="fecha"
          value={form.fecha}
          onChange={handleChange}
          max={
            new Date()
              .toISOString()
              .split("T")[0]
          }
        />

        <label>Regional</label>
        <select
          name="regional"
          value={form.regional}
          onChange={handleChange}
        >
          <option>POPAYAN</option>
          <option>BOGOTA</option>
          <option>MEDELLIN</option>
        </select>

        <label>Área</label>
        <select
          name="area"
          value={form.area}
          onChange={handleChange}
        >
          <option>ADMINISTRATIVA</option>
          <option>COMERCIAL</option>
          <option>OPERACIONES</option>
        </select>

        <label>Punto de venta</label>
        <select
          name="puntoVenta"
          value={form.puntoVenta}
          onChange={handleChange}
        >
          <option>POPAYAN</option>
          <option>CALI</option>
          <option>BOGOTA</option>
        </select>

        <label>Tipo</label>
        <select
          name="tipo"
          value={form.tipo}
          onChange={handleChange}
        >
          <option>Ingreso</option>
          <option>Traslado</option>
          <option>Baja</option>
        </select>

        <label>Quien recibe</label>
        <input
          name="recibe"
          value={form.recibe}
          onChange={handleChange}
          placeholder="Nombre"
        />

        <input
          name="ccRecibe"
          value={form.ccRecibe}
          onChange={handleChange}
          placeholder="Documento"
        />

        <label>Quien entrega</label>
        <input
          name="entrega"
          value={form.entrega}
          onChange={handleChange}
          placeholder="Nombre"
        />

        <input
          name="ccEntrega"
          value={form.ccEntrega}
          onChange={handleChange}
          placeholder="Documento"
        />

        <label>Autorizado por</label>
        <input
          name="autorizado"
          value={form.autorizado}
          onChange={handleChange}
          placeholder="Nombre"
        />

        <input
          name="ccAutoriza"
          value={
            form.ccAutoriza
          }
          onChange={
            handleChange
          }
          placeholder="Documento"
        />

        <h3>Firmas</h3>

        <label>Firma autorizado</label>
        <input
          type="file"
          onChange={(e) =>
            subirFirma(e, "autorizado")
          }
        />

        <label>Firma entrega</label>
        <input
          type="file"
          onChange={(e) =>
            subirFirma(e, "entrega")
          }
        />

        <label>Firma recibe</label>
        <input
          type="file"
          onChange={(e) =>
            subirFirma(e, "recibe")
          }
        />

        <button onClick={agregarFila}>
          + Agregar Activo
        </button>

        <button
          className="pdf-btn"
          onClick={descargarPDF}
        >
          Descargar PDF
        </button>
      </div>

      <div className="preview-wrapper">
        <div className="document" ref={pdfRef}>
  {/* HEADER */}
  <div className="top-table">
    <div className="logo-space">
      <div className="logo-placeholder">
        <img src="logo.png" alt="Logo" className="logoelectrocreditos" />
      </div>
    </div>

    <div className="header-center">
      <div>
        PROCESO EVALUACIÓN Y CONTROL
        <br />
        PROCEDIMIENTO DE AUDITORIA INTERNA
        <br />
        ARPESOD ASOCIADOS SAS
        <br />
        NIT. 900.333.755-6
        <br />
        SOLICITUD DE INGRESO, TRASLADO Y/O
        DAR DE BAJA ACTIVOS FIJOS
      </div>
    </div>

    <div className="header-title">
      
    </div>
  </div>

  
  {/* INFO */}
  <div className="info-row">
    <div>
      <strong>Fecha:</strong>{" "}
      {form.fecha}
    </div>

    <div>
      <strong>Regional:</strong>{" "}
      {form.regional}
    </div>
  </div>

  <div className="info-row">
    <div>
      <strong>Área:</strong>{" "}
      {form.area}
    </div>

    <div>
      <strong>
        Punto de Venta:
      </strong>{" "}
      {form.puntoVenta}
    </div>
  </div>

  {/* TEXTO */}
  <div className="legal-text">
    Para formalizar la
    solicitud, en la presente
    acta quedarán consignados
    los equipos y muebles que
    están bajo su
    responsabilidad, buen uso
    y cuidado. Los daños que
    se generen le serán
    descontados automáticamente.
    <br />
    <br />
    Cuando haya terminación
    del contrato laboral o
    retiro voluntario, usted
    debe hacer entrega de los
    activos fijos aquí
    estipulados al líder de
    zona o en su defecto al
    nuevo encargado del
    puesto, ya que este será
    un requisito indispensable
    para la firma de paz y
    salvo por parte de la
    empresa.
  </div>

  {/* TABLA */}
  <table className="acta-table">
  <thead className="acta-table-head">
    <tr>
      <th>Código</th>
      <th>Serie</th>
      <th>Marca</th>
      <th>
        Descripción del
        Activo
      </th>

      <th className="estado-header">
        Estado
        <div className="estado-mini">
          <span>B</span>
          <span>R</span>
          <span>M</span>
        </div>
      </th>

      <th>
        Observaciones
      </th>

    </tr>
  </thead>

  <tbody>
  {activos.map(
    (activo, index) => (
      <tr key={index}>
        <td>
          <div className="cell-wrapper">
            <input
              value={activo.codigo}
              onChange={(e) =>
                handleActivoChange(
                  index,
                  "codigo",
                  e.target.value
                )
              }
            />

            <button
              className="floating-delete no-pdf"
              onClick={() =>
                eliminarFila(index)
              }
            >
              ✕
            </button>
          </div>
        </td>

        <td>
          <input
            value={activo.serie}
            onChange={(e) =>
              handleActivoChange(
                index,
                "serie",
                e.target.value
              )
            }
          />
        </td>

        <td>
          <input
            value={activo.marca}
            onChange={(e) =>
              handleActivoChange(
                index,
                "marca",
                e.target.value
              )
            }
          />
        </td>

        <td>
          <input
            value={activo.descripcion}
            onChange={(e) =>
              handleActivoChange(
                index,
                "descripcion",
                e.target.value
              )
            }
          />
        </td>

        <td>
          <div className="estado-x">
            <span
              onClick={() =>
                handleActivoChange(
                  index,
                  "estado",
                  "Bueno"
                )
              }
            >
              {activo.estado ===
              "Bueno"
                ? "X"
                : ""}
            </span>

            <span
            className="span2"
              onClick={() =>
                handleActivoChange(
                  index,
                  "estado",
                  "Regular"
                )
              }
            >
              {activo.estado ===
              "Regular"
                ? "X"
                : ""}
            </span>

            <span
            className="span2"
              onClick={() =>
                handleActivoChange(
                  index,
                  "estado",
                  "Malo"
                )
              }
            >
              {activo.estado ===
              "Malo"
                ? "X"
                : ""}
            </span>
          </div>
        </td>

        <td>
          <input
            value={activo.observacion}
            onChange={(e) =>
              handleActivoChange(
                index,
                "observacion",
                e.target.value
              )
            }
          />
        </td>
      </tr>
    )
  )}
</tbody>

</table>

  {/* OBS */}
  <div className="obs-box">
    <strong className="obstexto">
      OBSERVACIONES
      GENERALES:
    </strong>

    <textarea
      name="observaciones"
      value={
        form.observaciones
      }
      onChange={
        handleChange
      }
    />
  </div>

  <p className="certifico">
    Certifico que el equipo
    detallado fue por:
  </p>
  
    {/* TIPO */}
  <div className="tipo-row">
    <span>
      {form.tipo === "Ingreso"
        ? "☒"
        : "☐"}{" "}
      Ingreso
    </span>

    <span >
      {form.tipo === "Traslado"
        ? "☒"
        : "☐"}{" "}
      Traslado
    </span>

    <span>
      {form.tipo === "Baja"
        ? "☒"
        : "☐"}{" "}
      Baja
    </span>
  </div>


<div className="firma-real">

  {/* AUTORIZA */}
  <div className="firma-row">

    <div className="nombre-col">
      <p>
        {form.autorizado ||
          "MARY LUZ TRUJILLO"}
      </p>

      <div className="linea"></div>

      <strong>
        Autorizado por
      </strong>

      <p>
        CC:{" 25286841"}
        {form.ccEntrega}
      </p>
    </div>

    <div className="firma-col">
      {firmaImagen.autorizado ? (
        <img
          src={
            firmaImagen.autorizado
          }
          alt=""
          className="firma-img"
        />
      ) : (
        <SignatureCanvas
          ref={
            firmaAutorizaRef
          }
          penColor="black"
          canvasProps={{
            className:
              "signature-canvas",
          }}
        />
      )}

      <div className="linea"></div>
      <strong>Firma</strong>

      <input
        type="file"
        onChange={(e) =>
          subirFirma(
            e,
            "autorizado"
          )
        }
      />
    </div>

    <div className="fecha-col">
      <div className="linea"></div>
      <strong>Fecha</strong>
    </div>
  </div>

  {/* ENTREGA */}
  <div className="firma-row">
    <div className="nombre-col">
      <p>
        {form.entrega}
      </p>

      <div className="linea"></div>

      <strong>
        Nombre de quien
        entrega
      </strong>

      <p>
        CC:{" "}
        {form.ccEntrega}
      </p>
    </div>

    <div className="firma-col">
      {firmaImagen.entrega ? (
        <img
          src={
            firmaImagen.entrega
          }
          alt=""
          className="firma-img"
        />
      ) : (
        <SignatureCanvas
          ref={
            firmaEntregaRef
          }
          penColor="black"
          canvasProps={{
            className:
              "signature-canvas",
          }}
        />
      )}

      <div className="linea"></div>
      <strong>Firma</strong>

      <input
        type="file"
        onChange={(e) =>
          subirFirma(
            e,
            "entrega"
          )
        }
      />
    </div>

    <div className="fecha-col">
      <div className="linea"></div>
      <strong>Fecha</strong>
    </div>
  </div>

  {/* RECIBE */}
  <div className="firma-row">
    <div className="nombre-col">
      <p>
        {form.recibe}
      </p>

      <div className="linea"></div>

      <strong>
        Nombre de quien
        recibe
      </strong>
    </div>

    <div className="firma-col">
      {firmaImagen.recibe ? (
        <img
          src={
            firmaImagen.recibe
          }
          alt=""
          className="firma-img"
        />
      ) : (
        <SignatureCanvas
          ref={
            firmaRecibeRef
          }
          penColor="black"
          canvasProps={{
            className:
              "signature-canvas",
          }}
        />
      )}

      <div className="linea"></div>
      <strong>Firma</strong>

      <input
        type="file"
        onChange={(e) =>
          subirFirma(
            e,
            "recibe"
          )
        }
      />
    </div>

    <div className="fecha-col">
      <div className="linea"></div>
      <strong>Fecha</strong>
    </div>
  </div>
</div>

</div>
      </div>
    </div>
  );
}

export default App;