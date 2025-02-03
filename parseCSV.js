// Parse a CSV row, accounting for commas inside quotes                   
function parseRow(row){
  var insideQuote = false,                                             
      entries = [],                                                    
      entry = [];
  row.split('').forEach(function (character) {                         
    if(character === '"') {
      insideQuote = !insideQuote;                                      
    } else {
      if(character == "," && !insideQuote) {                           
        entries.push(entry.join(''));                                  
        entry = [];                                                    
      } else {
        entry.push(character);                                         
      }                                                                
    }                                                                  
  });
  entries.push(entry.join(''));                                        
  return entries;                                                      
}

//
function parseCSV(textData) {
  // Split the input into lines
  lines = textData.split('\r\n'),

  // Extract column names from the first line
  columnNamesLine = lines[0],
  columnNames = parseRow(columnNamesLine),

  // Extract data from subsequent lines
  dataLines = lines.slice(1),
  data = dataLines.map(parseRow);

  console.log("column names:");
  console.log(JSON.stringify(columnNames));
  console.log("data:");
  console.log(JSON.stringify(data));

  return data;
}
