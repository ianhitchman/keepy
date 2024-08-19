import { Card } from "../../../types/Card";

const fixedColumnWidth = 256;
const mobileBreakpoint = 600;
const breakpoints = [
  {
    breakpoint: 500,
    columns: 1,
  },
  {
    breakpoint: 1000,
    columns: 2,
  },
  {
    breakpoint: 1500,
    columns: 3,
  },
  {
    breakpoint: 20000,
    columns: 4,
  },
];

const util = {
  getColumnsDimensions: (container: HTMLElement | null) => {
    const viewportWidth = window.innerWidth;

    // get parent dimensions
    const parent = container?.parentElement;
    let parentWidth = parent?.getBoundingClientRect().width || 0;
    // get left and right padding for parent
    const style = parent && window.getComputedStyle(parent);
    const paddingLeft = parseFloat(style?.paddingLeft || "0");
    const paddingRight = parseFloat(style?.paddingRight || "0");
    parentWidth -= paddingLeft + paddingRight;

    let containerWidth = container?.getBoundingClientRect().width || 0;
    if (containerWidth > parentWidth) containerWidth = parentWidth;
    let columns: number, columnWidthPx: number;

    if (viewportWidth <= mobileBreakpoint) {
      columns = 1;
      columnWidthPx = parentWidth;
      containerWidth = parentWidth;
    } else if (!fixedColumnWidth) {
      const breakpoint = breakpoints.find(
        (item) => item.breakpoint > viewportWidth
      );
      columns = breakpoint ? breakpoint.columns : 1;
      columnWidthPx = containerWidth / columns;
    } else {
      columns = Math.floor((parentWidth - 20) / fixedColumnWidth);
      columnWidthPx = fixedColumnWidth;
    }

    if (viewportWidth > mobileBreakpoint) {
      containerWidth = columns * columnWidthPx;
    }
    console.log(parentWidth, containerWidth, columnWidthPx);

    return { columns, columnWidthPx, containerWidth };
  },
  getDataAsRows: (data: Card[] | null, numberOfColumns: number) => {
    if (!data || Array.isArray(data) === false) return [];
    const rows = [];
    for (let i = 0; i < data.length; i += numberOfColumns) {
      rows.push(data.slice(i, i + numberOfColumns));
    }
    return rows;
  },
  getPositionRelativeToDocument: (element: Element | null) => {
    if (!element) return { x: 0, y: 0, width: 0 };
    // Get the bounding rectangle of the element
    const rect = element.getBoundingClientRect();

    // Get the current scroll position of the window
    const scrollTop =
      window.scrollY || window.pageYOffset || document.documentElement.scrollTop;
    const scrollLeft =
      window.scrollX || window.pageXOffset || document.documentElement.scrollLeft;

    // Function to parse the transform matrix
    function parseTransformMatrix(transform: string) {
      const matrix = transform.match(/^matrix\(([^)]+)\)$/);
      if (matrix) {
        return matrix[1].split(", ").map(parseFloat);
      }
      return [1, 0, 0, 1, 0, 0]; // Default matrix (identity matrix)
    }

    // Retrieve the transform property
    const transform = window.getComputedStyle(element)?.transform;

    // Get coordinates relative to the document
    const absX = (rect.left + scrollLeft) || 0;
    const absY = (rect.top + scrollTop) || 0;
    // Get coordinates from transform property
    const transX = transform ? parseTransformMatrix(transform)[4] * -1 : 0;
    const transY = transform ? parseTransformMatrix(transform)[5] * -1 : 0;
    // Get total Y position, including transform
    const x = absX + transX;
    const y = absY + transY;

    return { x, absX, transX, y, absY, transY };
  },
  getColumnHeightAtRow: (row: number, column: number, allCardElements: (Element | null)[][]) => {
    if (allCardElements.length === 0) {
      return 0;
    }
    let columnHeight = 0;

    allCardElements.forEach((currentRow, currentRowNum) => {
      currentRow.forEach((card: Element | null) => {
        if (!card) return;
        const columnNumber = parseInt(card.getAttribute("data-column") || "0");
        if (currentRowNum < row && columnNumber === column) {
          const cardRect = card.getBoundingClientRect();
          columnHeight += cardRect.height || 0;
        }
      });
    });
    return columnHeight || 0;
  },
  sortElementsByHeight: (elements: (Element | null)[] | null) => {
    if (!elements) return [];

    return elements.filter((element) => element !== null)
      ?.sort((a, b) => {
        const aHeight = a.getBoundingClientRect().height;
        const bHeight = b.getBoundingClientRect().height;
        return aHeight - bHeight;
      });
  },

  getTallestColumn: (container: HTMLElement | null, rows: Card[][]) => {
    const numberOfColumns = rows[0]?.length || 0;
    let tallestColumnHeight = 0;
    for (let i = 0; i < numberOfColumns; i++) {
      const columnCards = container?.querySelectorAll(`[data-column="${i}"]`);
      if (!columnCards) return 0;
      let columnHeight = 0;
      columnCards.forEach((card) => {
        const cardRect = card.getBoundingClientRect();
        columnHeight += cardRect.height || 0;
      });
      if (columnHeight > tallestColumnHeight) {
        tallestColumnHeight = columnHeight;
      }
    }
    return tallestColumnHeight || 0;
  },
};

export default util;
