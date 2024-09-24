import { DateTime } from "luxon";

const utils = {
  // Expand shorthand hex notation, e.g. "#fff" -> "#ffffff"
  expandHex: (hex: string) => {
    // Check if shorthand hex notation is used
    var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, function (_m, r, g, b) {
      return r + r + g + g + b + b;
    });
    return hex;
  },
  // Convert a hex colour to rgb values
  hexToRgb: (hex: string) => {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
      : { r: 0, g: 0, b: 0 };
  },
  // Get the contrasting color (black or white) based on the input color
  getContrastingColor: (color?: string | null) => {
    if (!color) return 'black';
    // Expand shorthand hex notation
    color = utils.expandHex(color);
    // Convert input color to RGB values
    var colorRgb = utils.hexToRgb(color);
    // Get the luminance of the input color
    var colorLuminance =
      (0.299 * colorRgb.r + 0.587 * colorRgb.g + 0.114 * colorRgb.b) / 255;
    // Return "black" if the luminance is greater than or equal to 0.5, else return "white"
    return colorLuminance >= 0.5 ? "black" : "white";
  },
  // Return formatted date string with time
  getFormattedDateTime: (date?: string) => {
    if (!date) return "-";
    date = date.replace(/\s/g, "T");
    const dateObj = DateTime.fromISO(date);
    if (!dateObj.isValid) return "-";

    const formattedDate = dateObj.toFormat("d MMMM yyyy, h:mm a");
    return formattedDate;
  },
  // Remove any HTML tags
  stripTags: (str: string, retainLinebreaks = false) => {
    if (!str || typeof str !== "string") return "";
    if (retainLinebreaks) {
      str = str.replace(/<\/(p|div|h1|h2|h3|h4|h5|h6)>|<br\s*\/?>/g, "[BREAK]");
    }
    str = str.replace(/(<([^>]+)>)/gi, "");
    if (retainLinebreaks) {
      str = str.replace(/\[BREAK\]/g, "<br />");
    }
    return str;
  },

  // add a zero-width break at the specified interval
  breakSplit: (text: string, limit = 0) => {
    if (limit === 0) return text;
    // split string into words
    const words = text.split(" ");
    // hold lines of text in an array
    const lines = [] as string[][];
    // loop through each word
    words.forEach((word) => {
      const lastLine = lines[lines.length - 1];
      // get total number of characters for all elements in last line
      const lastLineLength = lastLine
        ? lastLine.reduce((acc, val) => acc + val.length, 0)
        : 0;
      // would adding this word to the last line exceed the limit?
      if (lastLine && lastLineLength + word.length <= limit) {
        lastLine.push(word);
      } else {
        // is the word longer than the limit?
        if (word.length > limit) {
          // add breakpoints at the specified interval
          const regex = new RegExp(`(.{${limit}})`, "g");
          word = word.replace(regex, "$1\u00AD"); //200B
        }
        // create a new line
        lines.push([word]);
      }
    });
    // join the lines with spaces
    return lines.map((line) => line.join(" ")).join(" ");
  },
  // Truncate a string to a certain length, retaining whole words
  truncateString: (
    str?: string,
    maxLen = 50,
    brSplit = 0,
    retainLinebreaks = false
  ) => {
    if (!str || typeof str !== "string") return "";

    // Remove any HTML tags
    const plainTextStr = utils.stripTags(str, retainLinebreaks);

    // Limit the output string to maxLen characters
    let truncatedStr = plainTextStr.substring(0, maxLen);
    if (truncatedStr.length === maxLen) {
      // Use the last whole word as a cut-off point
      const lastSpaceIndex = truncatedStr.lastIndexOf(" ") || -1;
      if (lastSpaceIndex !== -1) {
        truncatedStr = truncatedStr.substring(0, lastSpaceIndex);
      }
    }
    const textHasChanged = plainTextStr !== truncatedStr;
    truncatedStr = utils.breakSplit(truncatedStr, brSplit);
    return !textHasChanged ? truncatedStr : truncatedStr + "…";
  },
  // Get the icon name for a file based on its MIME type
  getMimeIcon: (mime = "") => {
    if (mime.substring(0, 5) === "video") return "video";
    if (mime.substring(0, 5) === "audio") return "music";
    if (mime.substring(0, 5) === "image") return "jpg";
    if (mime.search("excel") >= 0 || mime.search("spreadsheet") >= 0)
      return "excel";
    if (mime.search("word") >= 0) return "word";
    if (mime === "application/gzip" || mime === "application/zip") return "zip";
    if (mime === "application/pdf") return "pdf";
    return "text";
  }
}

export default utils;