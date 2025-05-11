document.getElementById('registerSubject').onsubmit = function(e) {
  e.preventDefault();
  const subject = document.getElementById('subject').value;
  const total = Number(document.getElementById('total').value);
  const minPercent = Number(document.getElementById('minPercent').value);
  const attended = 0;
  const elapsed = 0;

  const subjects = JSON.parse(localStorage.getItem('subjects')) || [];

  subjects.push({ subject, total, minPercent, attended, elapsed });

  localStorage.setItem('subjects', JSON.stringify(subjects));

  e.target.reset();
  alert('Subject registered!');
};
