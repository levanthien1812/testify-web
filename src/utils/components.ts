export function setEqualHeight(container: HTMLElement, itemSelector: string) {
    const items = container.querySelectorAll<HTMLElement>(itemSelector);

    if (items.length === 0) return;

    items.forEach((item) => {
        item.style.height = "auto";
    });

    const maxHeight = Math.max(
        ...Array.from(items).map((item) => item.offsetHeight)
    );

    items.forEach((item) => {
        item.style.height = `${maxHeight}px`;
    });
}
