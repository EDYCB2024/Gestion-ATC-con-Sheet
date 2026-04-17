function doGet(e) {
  const type = e.parameter.type || 'cases';
  const id = e.parameter.id;
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  
  try {
    // Buscamos DATA o Timeline con fallback para minúsculas
    const sheetName = type === 'cases' ? 'DATA' : 'Timeline';
    let sheet = ss.getSheetByName(sheetName) || ss.getSheetByName(sheetName.toLowerCase()) || ss.getSheetByName(sheetName.toUpperCase());
    
    if (!sheet) {
      return renderJson({ 
        error: "Pestaña '" + sheetName + "' no encontrada. Revisa que se llame exactamente así en tu Excel." 
      });
    }
    
    const data = sheet.getDataRange().getValues();
    if (data.length <= 1) return renderJson([]); 
    
    // AUTO-DETECCIÓN DE ENCABEZADOS:
    // Buscamos la fila que contiene palabras clave específicas para no confundir con el título
    let headerIndex = -1;
    for (let i = 0; i < data.length; i++) {
       const rowStr = data[i].join("|").toLowerCase();
       if (rowStr.includes("caso") && rowStr.includes("rif") && rowStr.includes("serial")) {
         headerIndex = i;
         break;
       }
    }
    
    if (headerIndex === -1) {
      return renderJson({ error: "Encabezados no encontrados. Asegúrate de tener las columnas 'CASO #', 'RIF' y 'SERIAL'." });
    }
    
    const headers = data[headerIndex];
    const rows = data.slice(headerIndex + 1);
    
    const results = rows.map(row => {
      let obj = {};
      headers.forEach((h, i) => {
        const key = cleanHeader(h || "");
        if (key !== "col_unknown") { // Evitamos columnas vacías
          obj[key] = row[i];
        }
      });
      return obj;
    }).filter(item => item.caso); // Solo devolvemos filas que tengan número de caso

    if (type === 'timeline' && id) {
      return renderJson(results.filter(entry => entry.caso.toString() === id.toString()));
    }
    
    return renderJson(results);
  } catch (error) {
    return renderJson({ error: "Error interno: " + error.toString() });
  }
}

/**
 * Limpia encabezados complejos para usarlos como llaves de objeto
 */
function cleanHeader(str) {
  if (!str) return "col_unknown";
  
  return str.toString()
    .toLowerCase()
    .replace(/[#]/g, '')
    .replace(/[áéíóú]/g, (m) => ({'á':'a','é':'e','í':'i','ó':'o','ú':'u'}[m]))
    .trim()
    .replace(/\s+(.)/g, function(match, group) {
      return group.toUpperCase();
    })
    .replace(/[^a-zA-Z0-9]/g, '');
}

function renderJson(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
