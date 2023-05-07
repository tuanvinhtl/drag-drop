// Get references to the columns and items
const columns = document.querySelectorAll(".column");

const data = [
  { id: 1, name: "Item 1", age: 13 },
  { id: 4, name: "Item 2", age: 12 },
  { id: 5, name: "Item 3", age: 3 },
  { id: 6, name: "Item 4", age: 41 },
  { id: 1, name: "Item 1", age: 13 },
  { id: 4, name: "Item 2", age: 12 },
  { id: 5, name: "Item 3", age: 3 },
  { id: 6, name: "Item 4", age: 41 },
  { id: 1, name: "Item 1", age: 13 },
  { id: 4, name: "Item 2", age: 12 },
  { id: 5, name: "Item 3", age: 3 },
  { id: 6, name: "Item 4", age: 41 },
];

const column = document.querySelector(".column");

data.forEach((itemData) => {
  const item = document.createElement("div");
  item.classList.add("item");
  item.draggable = true;
  item.textContent = itemData.name;
  item.dataset.itemid = itemData.id;
  item.addEventListener("dragstart", handleDragStart);
  column.appendChild(item);
});

const items = document.querySelectorAll(".item");
// Add event listeners for drag events to items
columns.forEach((column) => {
  column.addEventListener("dragover", handleDragOver);
  column.addEventListener("dragenter", handleDragEnter);
  column.addEventListener("dragleave", handleDragLeave);
  column.addEventListener("drop", handleDrop);
});

// Reference to the currently dragged item
let draggedItem = null;

// Event handler for when dragging starts
function handleDragStart(event) {
  draggedItem = event.target;
  event.dataTransfer.setData("text/plain", "");
  event.dataTransfer.effectAllowed = "move";
  event.target.classList.add('dragged');
  const itemId = event.target.dataset.itemid;
  event.dataTransfer.setData("text/plain", itemId);
}

// Event handler for when the dragged element is over an item
function handleDragOver(event) {
  event.preventDefault();
  // Find the item being dragged and the current target item
  const currentItem = event.target;
  const isSameColumn = currentItem.parentElement === draggedItem.parentElement;
  const isAfter = isDraggedAfter(currentItem, event.clientY);

  // If the item is being dragged within the same column and not in the same position
  if (
    isSameColumn &&
    draggedItem !== currentItem &&
    (isAfter || !currentItem.nextSibling)
  ) {
    // Insert the dragged item before or after the current item
    if (isAfter) {
      currentItem.parentElement.insertBefore(
        draggedItem,
        currentItem.nextSibling
      );
    } else {
      currentItem.parentElement.insertBefore(draggedItem, currentItem);
    }
  }
}

// Event handler for when the dragged element enters an item
function handleDragEnter(event) {
  event.target.classList.add("item-over");
}

// Event handler for when the dragged element leaves an item
function handleDragLeave(event) {
  event.target.classList.remove("item-over");
}

// Event handler for when an element is dropped on an item
function handleDrop(event) {
  event.preventDefault();
  event.target.classList.remove("item-over");

  const target = event.target;
  const isItem = target.classList.contains("item");
  console.log(isItem)

  // Find the nearest parent column
  const column = isItem ? target.closest(".column") : target;

  // Only perform the drop if there is a dragged item and the column is different from the parent column
  if (draggedItem && column !== draggedItem.parentNode) {
    column.appendChild(draggedItem);
  }
  Array.from(column.children).forEach(element => {
    element.classList.remove('dragged');
  });

  const draggedItemId = event.dataTransfer.getData("text/plain");

  // Find the dropped item based on the item ID
  const droppedItem = document.querySelector(
    `[data-itemid="${draggedItemId}"]`
  );
  if (droppedItem) {
    // Retrieve the relevant data from the dropped item's custom attributes
    const droppedItemId = droppedItem.dataset.itemid;

    console.log("Dropped Item ID:", droppedItemId);

    // Emit the column values
    const columnValues = Array.from(columns).map((column) => {
      return Array.from(column.children).map((child) => child.dataset.itemid);
    });

    const event = new CustomEvent("columnsUpdated", { detail: columnValues });
    document.dispatchEvent(event);

    console.log(columnValues);
    // Perform further actions with the dropped item data
  }

  draggedItem = null;


}

function isDraggedAfter(item, y) {
  const { top, height } = item.getBoundingClientRect();
  return y > top + height / 2;
}
