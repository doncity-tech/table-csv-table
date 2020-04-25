const qs = (elem) => {
  return document.querySelector(elem);
}

const toCsv = function (table) {
  // Query all rows
  const rows = table.querySelectorAll('tr');
  return [].slice.call(rows)
    .map(function (row) {
      // Query all cells
      const cells = row.querySelectorAll('th,td');
      return [].slice.call(cells)
        .map(function (cell) {
          return cell.textContent;
        })
        .join(',');
    })
    .join('\n');
};

const download = function (text, fileName) {
  const link = document.createElement('a');
  link.setAttribute('href', `data:text/csv;charset=utf-8,${encodeURIComponent(text)}`);
  link.setAttribute('download', fileName);
  link.style.display = 'none';
  document.body.appendChild(link);

  link.click();

  document.body.removeChild(link);
};

const table = document.getElementById('exportMe');
const exportBtn = document.getElementById('export');

exportBtn.addEventListener('click', function () {
  // Export to csv
  const csv = toCsv(table);
  // Download it
  download(csv, 'download.csv');
});

const csvToTable = (csv) => {
  let reader = new FileReader();
  reader.onload = (e) => {
    let rows = e.target.result.split('\n');
    let table = document.createElement('TABLE');
    table.setAttribute('id', 'exportMe');
    let thead = document.createElement('THEAD');
    let tbody = document.createElement('TBODY');
    rows.forEach(x => {
      let tr = document.createElement('TR');
      let cols = x.split(',');
      if (rows.indexOf(x) === 0) {
        cols.forEach(y => {
          let th = document.createElement('TH');
          th.textContent = y;
          tr.appendChild(th);
        });
        thead.appendChild(tr);
        table.appendChild(thead);
      } else {
        cols.forEach(y => {
          let td = document.createElement('TD');
          td.textContent = y;
          tr.appendChild(td);
        });
        tbody.appendChild(tr);
      }
      if (rows.indexOf(x) === (rows.length - 1)) {
        table.appendChild(tbody);
        qs('.table').appendChild(table);
      }
    });
  }
  reader.readAsText(csv);
}

qs('#upload').addEventListener('change', (e) => {
  let fileName = e.target.files[0].name;
  qs('.file-input').textContent = fileName;
});

qs('#uploadBtn').addEventListener('click', () => {
  csvToTable(qs('#upload').files[0]);
});

