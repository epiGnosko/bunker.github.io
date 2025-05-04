window.onload = function() {
  const subjectSelect = document.getElementById('subjectSelect');
  const subjects = JSON.parse(localStorage.getItem('subjects')) || [];
  subjectSelect.length = 1;
  subjects.forEach(subj => {
    const option = document.createElement('option');
    option.value = subj.subject;
    option.text = subj.subject;
    subjectSelect.appendChild(option);
  });
};

function createGraph(title, data) {
  const attendedWidth = (data.attended / data.total) * 100;
  const bunkedWidth = (data.bunked / data.total) * 100;
  const tentativeWidth = (data.tentative / data.total) * 100;

  return `
    <div class="scenario">
      <h3>${title}</h3>
      <div class="bar">
        ${data.attended > 0 ? `<div class="segment-attended" style="width:${attendedWidth}%"></div>` : ''}
        ${data.bunked > 0 ? `<div class="segment-bunked" style="width:${bunkedWidth}%"></div>` : ''}
        ${data.tentative > 0 ? `<div class="segment-tentative" style="width:${tentativeWidth}%"></div>` : ''}
      </div>
      <div class="stats">
        <span>Attended: ${data.attended}/${data.attended + data.bunked} (${Math.round(data.attended * 10000/(data.attended + data.bunked)) / 100}%)</span>
        <span>Bunked: ${data.bunked} (${Math.round(data.bunked * 10000/(data.attended + data.bunked)) / 100}%)</span>
        ${data.tentative > 0 ? `<span>Tentative: ${data.tentative} </span>` : ''}
      </div>
    </div>
  `;
}

document.getElementById('bunkForm').onsubmit = function(e) {
  e.preventDefault();
  const subject = document.getElementById('subjectSelect').value;
  const attended = Number(document.getElementById('attended').value);
  const elapsed = Number(document.getElementById('elapsed').value);

  const subjects = JSON.parse(localStorage.getItem('subjects')) || [];

  const subjectdata = subjects.find(
    s => s.subject === subject
  );
  
  if (subjectdata){
    const expectedClasses = Math.ceil(subjectdata.total * subjectdata.minPercent / 100);
    const tentative = subjectdata.total - elapsed;
    const classesToCatchUp = expectedClasses - attended;
    const bunksRemaining = tentative - classesToCatchUp;
    const bunked = elapsed - attended


    // Current scenario
    const currentData = {
      attended: attended,
      bunked: bunked,
      tentative: tentative,
      total: subjectdata.total
    };

    // Best case: attend all tentative
    const bestData = {
      attended: attended + tentative,
      bunked: bunked,
      tentative: 0,
      total: subjectdata.total
    };

    // Worst case: bunk all tentative
    const worstData = {
      attended: attended,
      bunked: bunked + tentative,
      tentative: 0,
      total: subjectdata.total
    };

    if (classesToCatchUp < 0){
      classesToCatchUp = 0;
    }

    // Generate HTML for all scenarios
    document.getElementById('result').innerHTML = `
      ${createGraph("Current Scenario", currentData)}
      ${createGraph("Best Case (Attend All Tentative)", bestData)}
      ${createGraph("Worst Case (Bunk All Tentative)", worstData)}
      <p style="text-align:center; margin-top:20px;">
        <strong>Bunks Remaining:</strong> ${tentative - classesToCatchUp}<br>
        <strong>Classes Remaining:</strong> ${tentative}
      </p>
      <p class="promotion">
        Do leave a star on <a href="https://github.com/epiGnosko/bunker.github.io"> GitHub </a>
      </p>
    `;

    document.getElementById('result').style.display = 'block';

    setTimeout(() => {
      window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    }, 100);
  }
  else {
    alert("subject not found");
  }
};

// PWA thingy
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('service-worker.js');
}

