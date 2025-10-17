document.querySelectorAll(".toggle-btn").forEach((button) => {
  let typingIntervals = new WeakMap(); // track typing timers per card

  button.addEventListener("click", function () {
    const card = this.closest(".card");
    const extraText = card.querySelector(".more-text");

    // If a typing animation is running, stop it before toggling
    if (typingIntervals.has(extraText)) {
      clearInterval(typingIntervals.get(extraText));
      typingIntervals.delete(extraText);
    }

    if (extraText.classList.contains("d-none")) {
      // Reveal text
      const fullText =
        extraText.dataset.fullText || extraText.textContent.trim();
      extraText.dataset.fullText = fullText; // store original once
      extraText.textContent = "";
      extraText.classList.remove("d-none");
      this.textContent = "Read Less";

      let i = 0;
      const typing = setInterval(() => {
        if (i < fullText.length) {
          extraText.textContent += fullText.charAt(i);
          i++;
        } else {
          clearInterval(typing);
          typingIntervals.delete(extraText);
        }
      }, 25);

      typingIntervals.set(extraText, typing);
    } else {
      // Hide text
      extraText.classList.add("d-none");
      this.textContent = "Read More";

      // stop any typing still in progress
      if (typingIntervals.has(extraText)) {
        clearInterval(typingIntervals.get(extraText));
        typingIntervals.delete(extraText);
      }
    }
  });
});
// Fade-in animation on scroll for service cards
const serviceCards = document.querySelectorAll(".service-card");
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("animate__animated", "animate__fadeInUp");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.2 }
);

serviceCards.forEach((card) => observer.observe(card));

document.addEventListener("DOMContentLoaded", () => {
  const testimonials = [
    {
      names: ["Grace Mwende", "David Kilonzo", "Faith Nduku"],
      comments: [
        "Naomi truly listens to our community needs. Her compassion is inspiring!",
        "Naomi's projects are changing lives, especially for the youth in Miwani.",
        "Naomi helped me take my last born kid to school last year!",
      ],
    },
    {
      names: ["Samuel Kioko", "Lucy Wanza", "Mary Mutheu"],
      comments: [
        "The Naomi Get Together rural healthcare outreach was a blessing to many families!",
        "Naomi stands for integrity and action, not empty promises.",
        "Naomi's transparency and vision give us hope for the future.",
      ],
    },
    {
      names: ["John Mumo", "Beatrice Kamwana", "Martin Mwongela"],
      comments: [
        "Education programs under Naomi's support have uplifted many children.",
        "Naomi motivates everyone to do more for their communities.",
        "Hon. Naomi is a leader we can count on, committed and real.",
      ],
    },
    {
      names: ["Cynthia Ndunge", "Peter Mwangi", "Alice Nthenya"],
      comments: [
        "The Naomi Get Together clean-up drives have brought people together beautifully.",
        "Naomi's passion for environment and sustainability is unmatched!",
        "Naomi truly represents unity, progress, and care for all.",
      ],
    },
  ];

  const speed = 50; // typing speed
  const pauseBetween = 1000; // delay between comments

  document.querySelectorAll(".testimonial-card").forEach((card, index) => {
    const nameEl = card.querySelector(".testimonial-name");
    const textEl = card.querySelector(".testimonial-text");

    let i = 0;
    let charIndex = 0;
    let isTyping = true;

    const typeEffect = () => {
      const currentName = testimonials[index].names[i % 3];
      const currentComment = testimonials[index].comments[i % 3];

      if (isTyping) {
        if (charIndex === 0) {
          nameEl.textContent = "— " + currentName; // show name immediately
        }

        if (charIndex < currentComment.length) {
          textEl.textContent += currentComment.charAt(charIndex);
          charIndex++;
          setTimeout(typeEffect, speed);
        } else {
          isTyping = false;
          setTimeout(() => {
            textEl.textContent = "";
            charIndex = 0;
            isTyping = true;
            i++;
            typeEffect();
          }, pauseBetween);
        }
      } else {
        // clear text before next comment
        textEl.textContent = "";
        charIndex = 0;
        isTyping = true;
        i++;
        setTimeout(typeEffect, 300);
      }
    };

    typeEffect();
  });
});

// Auto-update year in footer
document.getElementById("year").textContent = new Date().getFullYear();

//vote
document.addEventListener("DOMContentLoaded", () => {
  const buttons = document.querySelectorAll(".vote-btn");
  const naomiBar = document.getElementById("naomi-bar");
  const othersBar = document.getElementById("others-bar");
  const pollResult = document.getElementById("poll-result");

  // Generate random initial percentages on each page load
  let pollData = {
    naomi: Math.floor(Math.random() * 9) + 75, // 79-83%
    others: 0, // will calculate below
    userVote: localStorage.getItem("userVote") || null
  };
  pollData.others = 100 - pollData.naomi;

  function updateBars() {
  pollResult.style.display = "block";

  // Animate bars from 0 to target
  setTimeout(() => { // slight delay to trigger CSS transition
    naomiBar.style.width = pollData.naomi + "%";
    othersBar.style.width = pollData.others + "%";
  }, 50);

  // Update text AFTER a small delay for smooth effect
  setTimeout(() => {
    naomiBar.textContent = pollData.naomi + "%";
    othersBar.textContent = pollData.others + "%";
  }, 500);
}


  buttons.forEach(btn => {
    btn.addEventListener("click", () => {
      const choice = btn.getAttribute("data-choice");

      // If user switches vote
      if (pollData.userVote && pollData.userVote !== choice) {
        if (choice === "naomi") {
          pollData.naomi = Math.min(100, pollData.naomi + Math.floor(Math.random() * 3) + 2);
          pollData.others = 100 - pollData.naomi;
        } else {
          pollData.naomi = Math.max(0, pollData.naomi - (Math.floor(Math.random() * 3) + 2));
          pollData.others = 100 - pollData.naomi;
        }
      }

      // If first vote
      if (!pollData.userVote) {
        if (choice === "naomi") {
          pollData.naomi = Math.min(100, pollData.naomi + Math.floor(Math.random() * 2) + 1);
          pollData.others = 100 - pollData.naomi;
        } else {
          pollData.naomi = Math.max(0, pollData.naomi - (Math.floor(Math.random() * 2) + 1));
          pollData.others = 100 - pollData.naomi;
        }
      }

      pollData.userVote = choice;
      localStorage.setItem("userVote", choice); // remember choice per device
      updateBars();

      // highlight active button
      buttons.forEach(b => b.classList.remove("btn-success"));
      btn.classList.add("btn-success");
    });
  });

  // On load, highlight the vote if already voted
  if (pollData.userVote) {
    const votedBtn = document.querySelector(`.vote-btn[data-choice="${pollData.userVote}"]`);
    if (votedBtn) votedBtn.classList.add("btn-success");
  }

  updateBars();
});
