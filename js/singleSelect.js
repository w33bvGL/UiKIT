// Author: Jonny sins
// Email: w33bv.gl@gmail.com

export function SingleSelectTag(el, customs = { shadow: false, rounded: true }) {
  // Initialize variables
  var element = null,
    options = null,
    customSelectContainer = null,
    wrapper = null,
    btnContainer = null,
    body = null,
    inputContainer = null,
    inputBody = null,
    input = null,
    button = null,
    drawer = null,
    ul = null;

  // Initialize DOM Parser
  var domParser = new DOMParser();

  // Initialize
  init();

  function init() {
    // DOM element initialization
    element = document.getElementById(el);
    createElements();
    initOptions();

    // Initialize selectedValue
    var selectedValue = null;

    // Event listeners
    button.addEventListener("click", () => {
      if (drawer.classList.contains("hidden")) {
        drawer.classList.remove("hidden");
        input.focus();
      } else {
        drawer.classList.add("hidden");
      }
    });

    input.addEventListener("keyup", (e) => {
      initOptions(e.target.value);
    });

    window.addEventListener("click", (e) => {
      if (!customSelectContainer.contains(e.target)) {
        drawer.classList.add("hidden");
      }
    });
  }

  function createElements() {
    // Create custom elements
    options = getOptions();
    element.classList.add("hidden");

    // .select-tag
    customSelectContainer = document.createElement("div");
    customSelectContainer.classList.add("select-tag");

    // .container
    wrapper = document.createElement("div");
    wrapper.classList.add("wrapper");

    // body
    body = document.createElement("div");
    body.classList.add("body");
    if (customs.shadow) {
      body.classList.add("shadow");
    }
    if (customs.rounded) {
      body.classList.add("rounded");
    }

    // .input-container
    inputContainer = document.createElement("div");
    inputContainer.classList.add("input-container");

    // input
    input = document.createElement("input");
    input.classList.add("input");
    input.placeholder = `${customs.placeholder || "Search..."}`;

    inputBody = document.createElement("div");
    inputBody.classList.add("input-body");
    inputBody.append(input);

    body.append(inputContainer);

    btnContainer = document.createElement("div");
    btnContainer.classList.add("btn-container");

    button = document.createElement("button");
    button.type = "button";
    btnContainer.append(button);

    const icon = domParser.parseFromString(
      `<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="18 15 12 21 6 15"></polyline>
          </svg>`,
      "image/svg+xml"
    ).documentElement;

    button.append(icon);

    body.append(btnContainer);
    wrapper.append(body);

    drawer = document.createElement("div");
    drawer.classList.add(...["drawer", "hidden"]);
    if (customs.shadow) {
      drawer.classList.add("shadow");
    }
    if (customs.rounded) {
      drawer.classList.add("rounded");
    }
    drawer.append(inputBody);
    ul = document.createElement("ul");

    drawer.appendChild(ul);

    customSelectContainer.appendChild(wrapper);
    customSelectContainer.appendChild(drawer);

    if (element.nextSibling) {
      element.parentNode.insertBefore(
        customSelectContainer,
        element.nextSibling
      );
    } else {
      element.parentNode.appendChild(customSelectContainer);
    }
  }

  function createElementInSelectList(option, val) {
    const li = document.createElement("li");
    li.textContent = option.label;
    li.dataset.value = option.value;

    if (val && option.label.toLowerCase().startsWith(val.toLowerCase())) {
      ul.appendChild(li);
    } else if (!val) {
      ul.appendChild(li);
    }
  }

  function initOptions(val = null) {
    ul.innerHTML = "";
    for (var option of options) {
      createElementInSelectList(option, val);
      if (option.selected) {
        createTag(option);
        const selectedLi = ul.querySelector(`li[data-value="${option.value}"]`);
        if (selectedLi) {
          selectedLi.classList.add("active");
          console.log("gtnvav ka");
        }
      }
    }

    ul.querySelectorAll("li").forEach((li) => {
      li.addEventListener("click", () => {
        drawer.classList.add("hidden");
        const selectedOption = options.find((o) => o.value == li.dataset.value);
        createTag(selectedOption);

        ul.querySelectorAll("li").forEach((li) => {
          li.classList.remove("active");
        });

        li.classList.add("active");
      });
    });
  }

  function setValues(selectedValue, fireEvent = true) {

    element.value = selectedValue;
    if ("createEvent" in document) {
      var evt = document.createEvent("HTMLEvents");
      evt.initEvent("change", false, true);
      element.dispatchEvent(evt);
    } else {
      element.fireEvent("onchange");
    }
    var selected_values = [];
    for (var i = 0; i < options.length; i++) {
      if (options[i].value === selectedValue) {
        options[i].selected = true;
        selected_values.push({
          label: options[i].label,
          value: options[i].value,
        });
      } else {
        options[i].selected = false;
      }
    }
    if (fireEvent && customs.hasOwnProperty("onChange")) {
      customs.onChange(selected_values);
    }
  }

  function createTag(option) {
    inputContainer.innerHTML = "";

    const itemDiv = document.createElement("div");
    itemDiv.classList.add("item-container");

    const itemLabel = document.createElement("div");
    itemLabel.classList.add("item-label");
    itemLabel.innerHTML = option.label;
    itemLabel.dataset.value = option.value;

    itemDiv.appendChild(itemLabel);
    inputContainer.appendChild(itemDiv);

    itemLabel.classList.add("active");

    setValues(option.value);
  }

  function getOptions() {
    return [...element.options].map((op) => {
      return {
        value: op.value,
        label: op.label,
        selected: op.selected,
      };
    });
  }
}
