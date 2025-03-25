document.addEventListener("DOMContentLoaded", () => {
        const form = document.getElementById("dog-form");
        const tableBody = document.getElementById("table-body");
        let allDogs = [];
        let currentDogId = null; // stores the id of the dog being edited
      
        // Fetch and render all dogs in the table
        function fetchDogs() {
          fetch("http://localhost:3000/dogs")
            .then((res) => res.json())
            .then((dogs) => {
              allDogs = dogs;
              
              renderDogs(allDogs);
             
              if (allDogs.length > 0) {
                currentDogId = allDogs[0].id;
                populateForm(allDogs[0]);
              }
            })
            .catch((error) => console.error("Error fetching dogs:", error));
        }
      
        // Render the dogs in the table body
        function renderDogs(dogs) {
          tableBody.innerHTML = "";
          dogs.forEach((dog) => {
            const tr = document.createElement("tr");
      
            const tdName = document.createElement("td");
            tdName.textContent = dog.name;
      
            const tdBreed = document.createElement("td");
            tdBreed.textContent = dog.breed;
      
            const tdSex = document.createElement("td");
            tdSex.textContent = dog.sex;
      
            const tdEdit = document.createElement("td");
            const editButton = document.createElement("button");
            editButton.textContent = "Edit";
            editButton.addEventListener("click", () => {
              currentDogId = dog.id;
              populateForm(dog);
            });
            tdEdit.appendChild(editButton);
      
            tr.appendChild(tdName);
            tr.appendChild(tdBreed);
            tr.appendChild(tdSex);
            tr.appendChild(tdEdit);
      
            tableBody.appendChild(tr);
          });
        }
      
        // Populate the form with a dog's information for editing
        function populateForm(dog) {
          form.name.value = dog.name;
          form.breed.value = dog.breed;
          form.sex.value = dog.sex;
        }
      
        // Handle form submission to update a dog's info
        form.addEventListener("submit", (e) => {
          e.preventDefault();
          if (!currentDogId) {
            console.error("No dog selected for editing.");
            return;
          }
      
          //  updated dog object 
          const updatedDog = {
            name: form.name.value,
            breed: form.breed.value,
            sex: form.sex.value,
            // Optionally update an "updated_at" timestamp here if needed
            updated_at: new Date().toISOString()
          };
      
          // Send PATCH request to update the dog's info
          fetch(`http://localhost:3000/dogs/${currentDogId}`, {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json"
            },
            body: JSON.stringify(updatedDog)
          })
            .then((res) => {
              if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status}`);
              }
              return res.json();
            })
            .then((data) => {
              console.log("Dog updated successfully:", data);
              // Refresh the list of dogs to display the updated info
              fetchDogs();
              // Optionally clear the form
              form.reset();
            })
            .catch((error) => console.error("Error updating dog:", error));
        });
      
        // Initial fetch of dogs on page load
        fetchDogs();
      });
      