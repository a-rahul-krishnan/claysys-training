const categoryCtx = document.getElementById("categoryChart");
      new Chart(categoryCtx, {
        type: "doughnut",
        data: {
          labels: ["Food", "Parking"],
          datasets: [
            {
              backgroundColor: ["red", "cornflowerblue"],
              data: [250, 50],
            },
          ],
        },
        options: {
          plugins: {
            legend: { display: true, position: "bottom" },
          },
        },
      });
      