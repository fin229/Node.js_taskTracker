export const truncate = (text, length) => {
    if (text?.length > length) {
        return text.substring(0, length - 3) + "...";
    }
    return text;
};
//# sourceMappingURL=StringUtil.js.map