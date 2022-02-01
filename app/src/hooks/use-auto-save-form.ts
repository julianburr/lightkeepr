import { useEffect, useRef } from "react";
import { useForm } from "react-cool-form";

const DEBOUNCE_AUTO_SAVE = 1000;

type UseAutoSaveFormArgs = Parameters<typeof useForm>;

export function useAutoSaveForm(...args: UseAutoSaveFormArgs) {
  const form = useForm(...args);

  // Auto save this form
  const values = form.use("values");
  const submitCount = form.use("submitCount");

  const isDirty = useRef(false);
  const isSubmit = useRef(false);
  const lastSubmitCount = useRef();

  // HACK: this is needed because `reset` in `react-cool-form` does NOT reset
  // `isDirty` for some reason, so we need to keep track of the actual dirty
  // state ourselves to be able to use it to know when we should auto save
  useEffect(() => {
    if (isSubmit.current === true) {
      // This check is needed because `react-cool-form` sets the submit count
      // and the values separately on submit, so the first trigger of this
      // `useEffect` will set `isSubmit` to true, the second trigger will reset
      // it to false
      isSubmit.current = false;
      isDirty.current = false;
    } else if (lastSubmitCount.current !== submitCount) {
      // Form has been submitted, so we want to reset `isDirty`
      lastSubmitCount.current = submitCount;
      if (submitCount) {
        isSubmit.current = true;
      }
      isDirty.current = false;
    } else if (!isDirty.current) {
      // Form is actually dirty
      isDirty.current = true;
    }
  }, [values, submitCount]);

  // Using a timer to debounce the auto save
  const timer = useRef<NodeJS.Timeout | null>(null);
  useEffect(() => {
    if (isDirty.current) {
      if (timer.current) {
        clearTimeout(timer.current);
      }
      timer.current = setTimeout(() => {
        timer.current = null;
        form.submit();
      }, DEBOUNCE_AUTO_SAVE);
    }
  }, [values]);

  // When the component unmounts, if the auto save timer hasn't triggered
  // yet, we want to trigger a submit just to be sure
  useEffect(() => {
    return () => {
      console.log({ timer: timer.current });
      if (timer.current) {
        clearTimeout(timer.current!);
        form.submit();
      }
    };
  }, []);

  return form;
}
