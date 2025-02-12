import * as React from 'react';
import { useUpdateEffect } from '../hooks/Hooks';
import { Tooltip } from '../tooltip/Tooltip';
import { classNames, DomHandler, IconUtils, ObjectUtils } from '../utils/Utils';
import { CheckboxBase } from './CheckboxBase';
import { CheckIcon } from '../icons/check';
export const Checkbox = React.memo(
    React.forwardRef((inProps, ref) => {
        const props = CheckboxBase.getProps(inProps);

        const [focusedState, setFocusedState] = React.useState(false);
        const elementRef = React.useRef(null);
        const inputRef = React.useRef(props.inputRef);

        const onClick = (event) => {
            if (!props.disabled && !props.readOnly && props.onChange) {
                const checked = isChecked();
                const checkboxClicked = event.target instanceof HTMLDivElement || event.target instanceof HTMLSpanElement || event.target instanceof Object;
                const isInputToggled = event.target === inputRef.current;
                const isCheckboxToggled = checkboxClicked && event.target.checked !== checked;

                if (isInputToggled || isCheckboxToggled) {
                    const value = checked ? props.falseValue : props.trueValue;

                    props.onChange({
                        originalEvent: event,
                        value: props.value,
                        checked: value,
                        stopPropagation: () => {},
                        preventDefault: () => {},
                        target: {
                            type: 'checkbox',
                            name: props.name,
                            id: props.id,
                            value: props.value,
                            checked: value
                        }
                    });
                }

                DomHandler.focus(inputRef.current);
                event.preventDefault();
            }
        };

        const onFocus = () => {
            setFocusedState(true);
        };

        const onBlur = () => {
            setFocusedState(false);
        };

        const onKeyDown = (event) => {
            if (event.code === 'Space' || event.key === ' ') {
                // event.key is for Android support
                onClick(event);
            }
        };

        const isChecked = () => {
            return props.checked === props.trueValue;
        };

        React.useImperativeHandle(ref, () => ({
            props,
            focus: () => DomHandler.focus(inputRef.current),
            getElement: () => elementRef.current,
            getInput: () => inputRef.current
        }));

        React.useEffect(() => {
            ObjectUtils.combinedRefs(inputRef, props.inputRef);
        }, [inputRef, props.inputRef]);

        useUpdateEffect(() => {
            inputRef.current.checked = isChecked();
        }, [props.checked, props.trueValue]);

        const checked = isChecked();
        const hasTooltip = ObjectUtils.isNotEmpty(props.tooltip);
        const otherProps = CheckboxBase.getOtherProps(props);
        const ariaProps = ObjectUtils.reduceKeys(otherProps, DomHandler.ARIA_PROPS);
        const className = classNames(
            'p-checkbox p-component',
            {
                'p-checkbox-checked': checked,
                'p-checkbox-disabled': props.disabled,
                'p-checkbox-focused': focusedState
            },
            props.className
        );
        const boxClass = classNames('p-checkbox-box', {
            'p-highlight': checked,
            'p-disabled': props.disabled,
            'p-focus': focusedState
        });
        const iconClassName = 'p-checkbox-icon p-c';
        const icon = checked ? props.icon || <CheckIcon className={iconClassName} /> : null;
        const checkboxIcon = IconUtils.getJSXIcon(icon, { className: iconClassName }, { props, checked });

        return (
            <>
                <div ref={elementRef} id={props.id} className={className} style={props.style} {...otherProps} onClick={onClick} onContextMenu={props.onContextMenu} onMouseDown={props.onMouseDown}>
                    <div className="p-hidden-accessible">
                        <input
                            ref={inputRef}
                            type="checkbox"
                            id={props.inputId}
                            name={props.name}
                            tabIndex={props.tabIndex}
                            defaultChecked={checked}
                            onFocus={onFocus}
                            onBlur={onBlur}
                            onKeyDown={onKeyDown}
                            disabled={props.disabled}
                            readOnly={props.readOnly}
                            required={props.required}
                            {...ariaProps}
                        />
                    </div>
                    <div className={boxClass}>{checkboxIcon}</div>
                </div>
                {hasTooltip && <Tooltip target={elementRef} content={props.tooltip} {...props.tooltipOptions} />}
            </>
        );
    })
);

Checkbox.displayName = 'Checkbox';
