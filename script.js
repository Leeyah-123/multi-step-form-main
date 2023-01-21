'use strict';

let currentStep = 1;
let currentDuration = 'monthly';
let currentPlan = 'Arcade';
let planPrice = 9;
let selectedAddons = [];

window.onload = function () {
  changeCurrentStep(currentStep);
  switchPlanDuration(currentDuration);
  setupFormInputListeners();

  document.body.classList.remove('hidden');
};

function changeCurrentStep(step) {
  // form validation
  if (step === 2) {
    if (!validateForm()) return;
  }

  currentStep = step;
  changeActiveStepper(currentStep);

  document.getElementById(`step${step}`).classList.remove('hidden');

  for (let i = 1; i <= 5; i++) {
    if (i !== step) {
      const stepElement = document.getElementById(`step${i}`);
      stepElement.classList.add('hidden');
    }
  }

  if (step === 1) {
    document.getElementById('prev').classList.add('hidden');
  } else {
    document.getElementById('prev').classList.remove('hidden');
  }

  if (step === 2) {
    setUpPlanEventListeners();
  }

  if (step === 4) {
    calculateTotal();
    document.getElementById('next').innerText = 'Confirm';
  } else {
    document.getElementById('next').innerText = 'Next Step';
  }

  if (step === 5) {
    document.getElementById('navigation').classList.add('hidden');
  } else {
    document.getElementById('navigation').classList.remove('hidden');
  }
}

function changeActiveStepper(step) {
  const steppers = document.getElementsByClassName('stepper-button');

  if (step === 5) step--;

  for (let i = 0; i < steppers.length; i++) {
    let stepper = steppers[i];

    if (i === step - 1) {
      stepper.classList.add('active');
    } else {
      stepper.classList.remove('active');
    }
  }
}

function handleDurationSwitch() {
  const currentDuration = document
    .getElementById('durationSwitchBtn')
    .getAttribute('data-selected');

  if (currentDuration === 'monthly') {
    switchPlanDuration('yearly');
    document
      .getElementById('durationSwitchBtn')
      .setAttribute('data-selected', 'yearly');
  } else {
    switchPlanDuration('monthly');
    document
      .getElementById('durationSwitchBtn')
      .setAttribute('data-selected', 'monthly');
  }
}

function switchPlanDuration(duration) {
  let durationElements;
  let eliminateDurationElements;
  currentDuration = duration;

  if (duration === 'monthly') {
    durationElements = document.querySelectorAll('.monthly');
    eliminateDurationElements = document.querySelectorAll('.yearly');
  } else {
    durationElements = document.querySelectorAll('.yearly');
    eliminateDurationElements = document.querySelectorAll('.monthly');
  }

  for (let i = 0; i < durationElements.length; i++) {
    let element = durationElements[i];
    element.classList.remove('hidden');
  }
  for (let i = 0; i < eliminateDurationElements.length; i++) {
    let element = eliminateDurationElements[i];
    element.classList.add('hidden');
  }
}

function setUpPlanEventListeners() {
  const radioBtns = document.getElementsByName('radio');

  for (let i = 0; i < radioBtns.length; i++) {
    let radioBtn = radioBtns[i];

    radioBtn.onclick = (e) => {
      if (e.target.id === 'plan__arcade') {
        currentPlan = 'Arcade';
        planPrice = 9;
      } else if (e.target.id === 'plan__advanced') {
        currentPlan = 'Advanced';
        planPrice = 12;
      } else {
        currentPlan = 'Pro';
        planPrice = 15;
      }
    };
  }
}

function setupFormInputListeners() {
  const formInputs = document.getElementsByName('formInput');

  for (let i = 0; i < formInputs.length; i++) {
    let formInput = formInputs[i];

    formInput.oninput = (e) => {
      if (formInput.value === '') {
        formInput.setAttribute('data-error', true);
      } else {
        formInput.setAttribute('data-error', false);
      }
    };
  }
}

function validateForm() {
  const formInputs = document.getElementsByName('formInput');
  let isValid = true;

  for (let i = 0; i < formInputs.length; i++) {
    let formInput = formInputs[i];

    if (formInput.value === '') {
      isValid = false;
      formInput.setAttribute('data-error', true);
    } else {
      if (isValid !== false) isValid = true;
    }
  }

  return isValid;
}

function calculateTotal() {
  selectedAddons = [];
  const addOns = document.getElementsByName('checkBox');

  for (let i = 0; i < addOns.length; i++) {
    let addOn = addOns[i];

    if (addOn.checked) selectedAddons.push(addOn.id);
  }

  let totalPlanCost;
  let duration;

  if (currentPlan === 'Arcade') totalPlanCost = 9;
  else if (currentPlan === 'Advanced') totalPlanCost = 12;
  else totalPlanCost = 15;

  if (currentDuration === 'monthly') duration = 'mo';
  else {
    duration = 'yr';
    totalPlanCost *= 10;
  }

  // dynamically rendering total
  document.getElementById('selectedPlan').innerText = currentPlan.replace(
    currentPlan.charAt(0),
    currentPlan.charAt(0).toUpperCase()
  );
  document.getElementById('selectedPlanDuration').innerText =
    currentDuration.replace(
      currentDuration.charAt(0),
      currentDuration.charAt(0).toUpperCase()
    );
  document.getElementById(
    'selectedPlanCost'
  ).innerText = `+$${totalPlanCost}/${duration}`;
  document.getElementById('selectedDuration').innerText = currentDuration.slice(
    0,
    -2
  );

  if (selectedAddons.length === 0)
    document.getElementById('selectedAddonsContainer').classList.add('hidden');
  else {
    document
      .getElementById('selectedAddonsContainer')
      .classList.remove('hidden');
    document.getElementById('selectedAddOnsList').innerHTML = '';

    for (let i = 0; i < selectedAddons.length; i++) {
      let selectedAddon = selectedAddons[i];

      let listItem = document.createElement('li');
      let addOnNameParagraph = document.createElement('p');
      let addOnCostParagraph = document.createElement('p');

      listItem.classList.add('selected_add-on');
      addOnNameParagraph.classList.add('add-on-name');
      addOnCostParagraph.classList.add('add-on-cost');

      let addOnCost;
      if (selectedAddon === 'onlineService') {
        addOnCost = 1;
        if (currentDuration === 'yearly') addOnCost *= 10;

        addOnNameParagraph.innerText = 'Online Service';
      } else if (selectedAddon === 'largerStorage') {
        addOnCost = 2;
        if (currentDuration === 'yearly') addOnCost *= 10;

        addOnNameParagraph.innerText = 'Larger Storage';
      } else {
        addOnCost = 2;
        if (currentDuration === 'yearly') addOnCost *= 10;

        addOnNameParagraph.innerText = 'Customizable Profile';
      }

      addOnCostParagraph.innerText = `+$${addOnCost}/${duration}`;
      listItem.appendChild(addOnNameParagraph);
      listItem.appendChild(addOnCostParagraph);

      document.getElementById('selectedAddOnsList').appendChild(listItem);

      totalPlanCost += addOnCost;
    }
  }

  document.getElementById(
    'totalCost'
  ).innerText = `+$${totalPlanCost}/${duration}`;
}
