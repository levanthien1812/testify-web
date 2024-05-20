// src/TextEditor.js
import "./styles.scss";
import Color from "@tiptap/extension-color";
import ListItem from "@tiptap/extension-list-item";
import TextStyle from "@tiptap/extension-text-style";
import { EditorProvider, useCurrentEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { MouseEventHandler, ReactNode, useState } from "react";
import styles from "./editor.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faA,
    faArrowTurnDown,
    faBold,
    faCode,
    faItalic,
    faListOl,
    faListUl,
    faParagraph,
    faRedo,
    faStrikethrough,
    faUndo,
} from "@fortawesome/free-solid-svg-icons";

type EditorButtonProps = {
    children: ReactNode;
    onClick: MouseEventHandler<HTMLButtonElement>;
    disabled?: boolean;
    className?: string;
};

const EditorButton = ({
    children,
    onClick,
    disabled,
    className,
}: EditorButtonProps) => {
    return (
        <button
            className={`border w-9 justify-center text-nowrap flex items-center py-2 text-sm border-black ${
                className === "is-active"
                    ? "bg-orange-600 text-white"
                    : "bg-white text-black"
            }`}
            onClick={onClick}
            disabled={disabled}
        >
            {children}
        </button>
    );
};

const MenuBar = () => {
    const { editor } = useCurrentEditor();

    if (!editor) {
        return null;
    }

    return (
        <div className="flex gap-1 items-start mb-2">
            <EditorButton
                onClick={() => editor.chain().focus().toggleBold().run()}
                disabled={!editor.can().chain().focus().toggleBold().run()}
                className={editor.isActive("bold") ? "is-active" : ""}
            >
                <FontAwesomeIcon icon={faBold} />
            </EditorButton>
            <EditorButton
                onClick={() => editor.chain().focus().toggleItalic().run()}
                disabled={!editor.can().chain().focus().toggleItalic().run()}
                className={editor.isActive("italic") ? "is-active" : ""}
            >
                <FontAwesomeIcon icon={faItalic} />
            </EditorButton>
            <EditorButton
                onClick={() => editor.chain().focus().toggleStrike().run()}
                disabled={!editor.can().chain().focus().toggleStrike().run()}
                className={editor.isActive("strike") ? "is-active" : ""}
            >
                <FontAwesomeIcon icon={faStrikethrough} />
            </EditorButton>
            <EditorButton
                onClick={() => editor.chain().focus().toggleCode().run()}
                disabled={!editor.can().chain().focus().toggleCode().run()}
                className={editor.isActive("code") ? "is-active" : ""}
            >
                <FontAwesomeIcon icon={faCode} />
            </EditorButton>

            <EditorButton
                onClick={() => editor.chain().focus().setParagraph().run()}
                className={editor.isActive("paragraph") ? "is-active" : ""}
            >
                <FontAwesomeIcon icon={faParagraph} />
            </EditorButton>
            <EditorButton
                onClick={() => editor.chain().focus().toggleBulletList().run()}
                className={editor.isActive("bulletList") ? "is-active" : ""}
            >
                <FontAwesomeIcon icon={faListUl} />
            </EditorButton>
            <EditorButton
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
                className={editor.isActive("orderedList") ? "is-active" : ""}
            >
                <FontAwesomeIcon icon={faListOl} />
            </EditorButton>
            <EditorButton
                onClick={() => editor.chain().focus().toggleCodeBlock().run()}
                className={editor.isActive("codeBlock") ? "is-active" : ""}
            >
                <FontAwesomeIcon icon={faCode} />
            </EditorButton>
            <EditorButton
                onClick={() => editor.chain().focus().setHardBreak().run()}
            >
                <FontAwesomeIcon icon={faArrowTurnDown} />
            </EditorButton>
            <EditorButton
                onClick={() => editor.chain().focus().undo().run()}
                disabled={!editor.can().chain().focus().undo().run()}
            >
                <FontAwesomeIcon icon={faUndo} />
            </EditorButton>
            <EditorButton
                onClick={() => editor.chain().focus().redo().run()}
                disabled={!editor.can().chain().focus().redo().run()}
            >
                <FontAwesomeIcon icon={faRedo} />
            </EditorButton>
            <EditorButton
                onClick={() => editor.chain().focus().setColor("#958DF1").run()}
                className={
                    editor.isActive("textStyle", { color: "#958DF1" })
                        ? "is-active"
                        : ""
                }
            >
                <FontAwesomeIcon icon={faA} className="text-purple-600" />
            </EditorButton>
        </div>
    );
};

const extensions = [
    Color.configure({ types: [TextStyle.name, ListItem.name] }),
    TextStyle.configure(),
    StarterKit.configure({
        bulletList: {
            keepMarks: true,
            keepAttributes: false, // TODO : Making this as `false` becase marks are not preserved when I try to preserve attrs, awaiting a bit of help
        },
        orderedList: {
            keepMarks: true,
            keepAttributes: false, // TODO : Making this as `false` becase marks are not preserved when I try to preserve attrs, awaiting a bit of help
        },
    }),
];

const TextEditor = () => {
    const [content, setContent] = useState("Hello my name is Thien");

    return (
        <EditorProvider
            slotBefore={<MenuBar />}
            extensions={extensions}
            content={content}
            onUpdate={(e) => {
                setContent(e.editor.getHTML());
            }}
        ></EditorProvider>
    );
};

export default TextEditor;
