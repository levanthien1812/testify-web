import { useEffect, useMemo, useRef } from "react";
import { TEST_LEVEL, TEST_LEVEL_LABEL } from "../../../config/constants/tests";
import Input from "../../../components/elements/Input";
import Select from "../../../components/elements/Select";
import { FormProvider, useForm } from "react-hook-form";
import Wrapper from "../../createTestPage/components/Wrapper";
import { createTestTemplateActions } from "../../../stores/createTestTemplate";
import { useMutation } from "react-query";
import { MUTATION_KEYS } from "../../../config/constants/queryMutationKeys";
import {
    createTestTemplate,
    updateTestTemplate,
} from "../../../services/testTemplate";
import { useDispatch } from "react-redux";
import { useAppSelector } from "../../../hooks/hooks";
import TemplateOptions from "./templateInfo/TemplateOptions";
import { TestTemplateBodyItf } from "../../../types/testTemplate";

const TemplateInfo = () => {
    const {
        saveTemplateInfo,
        initializeTemplateParts,
        moveNextStep,
        movePrevStep,
        validate: validateTemplate,
    } = createTestTemplateActions;
    const {
        templateName,
        testDescription,
        testDuration,
        templateId,
        level,
        numParts,
        numQuestions,
        maxScore,
        options,
        isValidTemplateInfo,
    } = useAppSelector((state) => state.createTestTemplate);

    const dispatch = useDispatch();

    const initialValues: TestTemplateBodyItf = useMemo(
        () => ({
            name: templateName,
            datetime: new Date().toISOString(),
            description: testDescription,
            duration: testDuration,
            max_score: maxScore,
            num_questions: numQuestions || 0,
            num_parts: numParts,
            level: level,
            options: options,
        }),
        [
            templateName,
            testDescription,
            testDuration,
            maxScore,
            numQuestions,
            numParts,
            level,
            options,
        ],
    );

    const { mutate: createTemplate, isLoading: createTemplateLoading } =
        useMutation({
            mutationFn: async (templateBody: TestTemplateBodyItf) =>
                await createTestTemplate(templateBody),
            mutationKey: [MUTATION_KEYS.CREATE_TEST_TEMPLATE],
            onSuccess: (data) => {
                dispatch(saveTemplateInfo({ templateId: data?.template?.id }));
                dispatch(initializeTemplateParts());
                dispatch(moveNextStep());
            },
        });

    const { mutate: updateTemplate, isLoading: updateTemplateLoading } =
        useMutation({
            mutationFn: async (templateBody: TestTemplateBodyItf) =>
                await updateTestTemplate(templateId || "", templateBody),
            mutationKey: [MUTATION_KEYS.UPDATE_TEST_TEMPLATE, { templateId }],
            onSuccess: (data) => {
                dispatch(initializeTemplateParts());
                dispatch(moveNextStep());
            },
        });

    const methods = useForm<TestTemplateBodyItf>({
        defaultValues: initialValues,
    });

    const {
        handleSubmit,
        formState: { errors, isDirty, dirtyFields },
        register,
        setValue,
        reset,
        watch,
        getValues,
    } = methods;

    const allValues = watch();

    const handleFieldBlur = () => {
        const values = getValues();
        dispatch(
            saveTemplateInfo({
                name: values.name,
                description: values.description,
                duration: values.duration,
                max_score: values.max_score,
                num_parts: values.num_parts,
                num_questions: values.num_questions,
                level: values.level,
                options: values.options,
            }),
        );
        dispatch(validateTemplate());
    };

    const onSubmit = async (data: TestTemplateBodyItf) => {
        if (!isDirty && templateId) {
            dispatch(moveNextStep());
            return;
        }
        // Save to Redux before creating/updating
        dispatch(
            saveTemplateInfo({
                name: data.name,
                description: data.description,
                duration: data.duration,
                max_score: data.max_score,
                num_parts: data.num_parts,
                num_questions: data.num_questions,
                level: data.level,
                options: data.options,
            }),
        );
        dispatch(validateTemplate());

        if (!templateId) createTemplate(data);
        else updateTemplate(data);
    };

    useEffect(() => {
        reset(initialValues, { keepDefaultValues: false });
    }, [initialValues, reset]);

    return (
        <Wrapper
            viewData={{
                headerTitle: { text: "Template Information (Step 1)" },
                bottomButtons: {
                    containButton: {
                        text: "Next",
                        isLoading:
                            createTemplateLoading || updateTemplateLoading,
                        loadingText: "Saving...",
                        disabled:
                            !isValidTemplateInfo ||
                            createTemplateLoading ||
                            updateTemplateLoading,
                        onClick: handleSubmit(onSubmit),
                    },
                },
            }}
        >
            <FormProvider {...methods}>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <Input
                        label={{ text: "Template Name" }}
                        placeholder="Enter template name"
                        {...register("name", {
                            required: "Template name is required",
                        })}
                        onBlur={handleFieldBlur}
                        error={errors.name?.message}
                    />

                    <Input
                        label={{ text: "Template Description" }}
                        placeholder="Enter template description"
                        {...register("description")}
                        onBlur={handleFieldBlur}
                        error={errors.description?.message}
                        type="textarea"
                    />

                    <Input
                        label={{ text: "Duration (minutes)" }}
                        placeholder="Enter duration"
                        {...register("duration", {
                            valueAsNumber: true,
                            required: "Duration is required",
                        })}
                        onBlur={handleFieldBlur}
                        error={errors.duration?.message}
                        type="number"
                    />

                    <Input
                        label={{ text: "Max Score" }}
                        placeholder="Enter max score"
                        {...register("max_score", {
                            valueAsNumber: true,
                            required: "Max score is required",
                        })}
                        onBlur={handleFieldBlur}
                        error={errors.max_score?.message}
                        type="number"
                    />

                    <Input
                        label={{ text: "Number of Parts" }}
                        placeholder="Enter number of parts"
                        {...register("num_parts", {
                            valueAsNumber: true,
                            min: {
                                value: 0,
                                message:
                                    "Number of parts must be greater than  or equal to 0",
                            },
                            validate: (value) => {
                                if (value === 1)
                                    return "Number of parts must be 0 or greater than 1";
                            },
                        })}
                        onBlur={handleFieldBlur}
                        error={errors.num_parts?.message}
                        type="number"
                    />

                    <Input
                        label={{ text: "Number of Questions" }}
                        placeholder="Enter number of questions"
                        {...register("num_questions", {
                            valueAsNumber: true,
                            required: "Number of questions is required",
                            min: {
                                value:
                                    allValues.num_parts > 1
                                        ? allValues.num_parts
                                        : 1,
                                message:
                                    allValues.num_parts > 1
                                        ? `Number of questions must be at least ${allValues.num_parts}`
                                        : "Number of questions must be greater than 0",
                            },
                        })}
                        onBlur={handleFieldBlur}
                        error={errors.num_questions?.message}
                        type="number"
                        helperText={
                            allValues.num_parts > 1
                                ? `Must be at least ${allValues.num_parts} questions (one for each part)`
                                : ""
                        }
                    />

                    <Select
                        label={{ text: "Level" }}
                        options={Object.entries(TEST_LEVEL_LABEL).map(
                            ([key, value]) => ({
                                label: value,
                                value: key,
                            }),
                        )}
                        {...register("level")}
                        onBlur={handleFieldBlur}
                        error={errors.level?.message}
                    />

                    <TemplateOptions />
                </form>
            </FormProvider>
        </Wrapper>
    );
};

export default TemplateInfo;
