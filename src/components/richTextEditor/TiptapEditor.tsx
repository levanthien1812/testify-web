// src/TextEditor.js
import "./styles.scss";
import Color from "@tiptap/extension-color";
import ListItem from "@tiptap/extension-list-item";
import TextStyle from "@tiptap/extension-text-style";
import Text from "@tiptap/extension-text";
import Paragraph from "@tiptap/extension-paragraph";
import Image from "@tiptap/extension-image";
import { EditorProvider, useCurrentEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import {
    MouseEventHandler,
    ReactNode,
    useEffect,
    useMemo,
    useState,
} from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faA,
    faArrowsLeftRightToLine,
    faArrowTurnDown,
    faBold,
    faCode,
    faImage,
    faItalic,
    faListOl,
    faListUl,
    faRedo,
    faStrikethrough,
    faUndo,
} from "@fortawesome/free-solid-svg-icons";
import { InputPlaceholder } from "./InputPlaceholder";
import Modal, { ModalBody, ModalFooter } from "../modals/Modal";

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
            className={`border w-fit px-2 min-w-8 shrink-0 justify-center text-nowrap flex items-center py-2 text-sm leading-none border-black active:bg-orange-600 active:text-white ${
                className === "is-active"
                    ? "bg-orange-600 text-white"
                    : "bg-white text-black"
            }`}
            type="button"
            onClick={onClick}
            disabled={disabled}
        >
            {children}
        </button>
    );
};

const MenuBar = ({
    withInsertGapButton = false,
}: {
    withInsertGapButton: boolean;
}) => {
    const { editor } = useCurrentEditor();

    useEffect(() => {
        if (editor && editor.isEditable) {
            editor.commands.focus();
        }
    }, [editor]);

    if (!editor) {
        return null;
    }

    return (
        <div className="flex gap-1 items-start mb-2 custom-scrollbar-x">
            {withInsertGapButton && (
                <EditorButton
                    onClick={() =>
                        editor.chain().focus().insertInputPlaceholder().run()
                    }
                    disabled={
                        !editor
                            .can()
                            .chain()
                            .focus()
                            .insertInputPlaceholder()
                            .run()
                    }
                >
                    Insert Gap
                </EditorButton>
            )}
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
                onClick={() => {
                    const url = window.prompt("Enter image URL:");
                    if (url) {
                        editor.chain().focus().setImage({ src: url }).run();
                    }
                }}
                disabled={!editor}
                className={editor.isActive("italic") ? "is-active" : ""}
            >
                <FontAwesomeIcon icon={faImage} />
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
    TextStyle.configure({}),
    Image,
    ListItem,
    Paragraph,
    Text,
    InputPlaceholder,
    StarterKit.configure({
        bulletList: {
            keepMarks: true,
            keepAttributes: false,
        },
        orderedList: {
            keepMarks: true,
            keepAttributes: false,
        },
    }),
];

type TextEditorProps = {
    content: string;
    setContent: (content: string) => void;
    setJson?: (json: string) => void;
    withInsertGapButton?: boolean;
    allowZoom?: boolean;
};

const HelperButtons = ({
    onInscrease,
    onDecrease,
}: {
    onInscrease: () => void;
    onDecrease: () => void;
}) => {
    return (
        <div className="flex gap-2 justify-end">
            <button type="button" onClick={onInscrease}>
                +
            </button>
            <button type="button" onClick={onDecrease}>
                -
            </button>
        </div>
    );
};

const TextEditor = ({
    content,
    setContent,
    setJson,
    withInsertGapButton = false,
    allowZoom = true,
}: TextEditorProps) => {
    const [isZoomed, setIsZoomed] = useState(false);

    const baseClasses = `max-w-none border border-black outline-none px-4 py-1 focus:border-orange-600 bg-white overflow-y-scroll custom-scrollbar-y resize-none max-h-[400px]`;

    const editorClasses = useMemo(() => {
        return !isZoomed
            ? `${baseClasses} h-[100px]`
            : `${baseClasses} h-[200px]`;
    }, [isZoomed, baseClasses]);

    const editor = (
        <EditorProvider
            slotBefore={<MenuBar withInsertGapButton={withInsertGapButton} />}
            extensions={extensions}
            content={content}
            onUpdate={(e) => {
                setContent(e.editor.getHTML());
                if (setJson) {
                    setJson(JSON.stringify(e.editor.getJSON()));
                }
            }}
            editorProps={{
                attributes: {
                    class: editorClasses,
                },
            }}
        ></EditorProvider>
    );

    return (
        <div className="relative">
            {!isZoomed && editor}
            {isZoomed && (
                <Modal
                    onClose={() => setIsZoomed(false)}
                    allowClickBackdropToClose
                >
                    <ModalBody>{editor}</ModalBody>
                    <ModalFooter includeCancelBtn></ModalFooter>
                </Modal>
            )}
            {allowZoom && (
                <button
                    type="button"
                    className="absolute bottom-1 right-1 bg-gray-100 rounded-sm py-0 px-1 leading-none hover:bg-gray-200 active:text-orange-600"
                    onClick={() => setIsZoomed(true)}
                >
                    <FontAwesomeIcon
                        icon={faArrowsLeftRightToLine}
                        className="text-xs text-gray-500 hover:text-gray-600"
                    />
                </button>
            )}
        </div>
    );
};

export default TextEditor;
