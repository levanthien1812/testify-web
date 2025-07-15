// InputPlaceholder.ts
import {
    CommandProps,
    Node,
    NodeViewRendererProps,
    mergeAttributes,
} from "@tiptap/core";
import { FILL_GAP_INDICATOR } from "../../config/constants/tests";

declare module "@tiptap/core" {
    interface Commands<ReturnType> {
        inputPlaceholder: {
            insertInputPlaceholder: () => ReturnType;
        };
    }
}

export const InputPlaceholder = Node.create({
    name: "inputPlaceholder",
    group: "inline",
    inline: true,
    atom: true,

    addAttributes() {
        return {
            id: {
                default: null,
            },
        };
    },

    parseHTML() {
        return [
            {
                tag: "span[data-input-placeholder]",
            },
        ];
    },

    renderHTML({ HTMLAttributes }) {
        return [
            "span",
            mergeAttributes(HTMLAttributes, {
                "data-input-placeholder": "",
            }),
            FILL_GAP_INDICATOR,
        ];
    },

    addCommands() {
        return {
            insertInputPlaceholder:
                () =>
                ({ commands }: CommandProps) => {
                    return commands.insertContent({
                        type: this.name,
                        attrs: {
                            id: `gap-${Math.floor(Math.random() * 10000)}`,
                        },
                    });
                },
        };
    },

    addNodeView() {
        return ({ editor, node, getPos }: NodeViewRendererProps) => {
            const dom = document.createElement("span");
            dom.dataset.inputPlaceholder = "";
            dom.className = "bg-orange-200 px-2 cursor-pointer";
            dom.innerText = FILL_GAP_INDICATOR;

            dom.onclick = () => {
                if (typeof getPos === "function") {
                    const pos = getPos();
                    editor.commands.deleteRange({
                        from: pos,
                        to: pos + node.nodeSize,
                    });
                }
            };

            return {
                dom,
            };
        };
    },
});
