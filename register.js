document.getElementById('registerSubject').onsubmit = function(e) {
  e.preventDefault();
  const subject = document.getElementById('subject').value;
  const total = Number(document.getElementById('total').value);
  const minPercent = Number(document.getElementById('minPercent').value);

  const subjects = JSON.parse(localStorage.getItem('subjects')) || [];

  subjects.push({ subject, total, minPercent });

  localStorage.setItem('subjects', JSON.stringify(subjects));

  e.target.reset();
  alert('Subject registered!');
};
