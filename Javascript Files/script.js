
// Blog post functions

const accordionContent = document.querySelectorAll(".accordion-content");

accordionContent.forEach((item, index) => {
  const header = item.querySelector("header");
  header.addEventListener("click", () => {
    item.classList.toggle("open");

    const description = item.querySelector(".description");
    if (item.classList.contains("open")) {
      description.style.height = `${description.scrollHeight / 16}em`;
      item.querySelector("i").classList.replace("fa-arrow-down", "fa-arrow-up");
    } else {
      description.style.height = "0px";
      item.querySelector("i").classList.replace("fa-arrow-up", "fa-arrow-down");
    }
    removeOpen(index);
  });
});

function removeOpen(index1) {
  accordionContent.forEach((item2, index2) => {
    if (index1 !== index2) {
      item2.classList.remove("open");

      const des = item2.querySelector(".description");
      des.style.height = "0px";
      item2.querySelector("i").classList.replace("fa-arrow-up", "fa-arrow-down");
    }
  });
}


// Sticky nav bar functions

window.addEventListener('scroll', () => {
  const navbar = document.querySelector('nav');
  if (window.pageYOffset > 0) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});


// Navigation functions

const navLinks = document.querySelectorAll('.nav ul li a');

navLinks.forEach((link) => {
  link.addEventListener('click', (event) => {
    event.preventDefault();

    const targetUrl = link.getAttribute('href');

    window.location.href = targetUrl;
  });
});



  document.addEventListener('DOMContentLoaded', function() {
   // Get the current URL of the page
var currentUrl = window.location.href;

// Get all the navigation links
var navLinks = document.querySelectorAll('nav ul li a');

// Loop through each link and add the 'active' class to the link with a matching href attribute
navLinks.forEach(function(link) {
    if(link.href === currentUrl) {
        link.classList.add('active');
    }
});

});


//particle

// Particle effect
var particleContainer = document.getElementById('particle-container');

function createParticle() {
    var particle = document.createElement('div');
    particle.className = 'particle';
    var randomX = Math.random() * window.innerWidth;
    var randomY = Math.random() * window.innerHeight;
    particle.style.left = randomX + 'px';
    particle.style.top = randomY + 'px';
    particleContainer.appendChild(particle);
    setTimeout(function() {
        particle.remove();
    }, 2000); // Remove particle after 3 seconds
}

setInterval(createParticle, 100);