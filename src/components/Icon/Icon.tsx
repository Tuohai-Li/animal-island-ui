import React from 'react';
import styles from './icon.module.less';
import classNames from 'classnames';

import { ITEM_URL_MAP, type IconName } from './iconRegistry';

export interface IconProps extends React.HTMLAttributes<HTMLSpanElement> {
    /** Built-in named icon. Mutually exclusive with `item`. */
    name?: IconName;
    /** Item glyph id from the "Items" sheet (see ITEM_LIST). Mutually exclusive with `name`. */
    item?: number;
    size?: number | string;
    bounce?: boolean;
}

export const Icon = React.forwardRef<HTMLSpanElement, IconProps>(
    (
        {
            name,
            item,
            size = 24,
            className,
            style,
            bounce = false,
            'aria-label': ariaLabel,
            'aria-labelledby': ariaLabelledBy,
            'aria-hidden': ariaHiddenProp,
            ...rest
        },
        ref
    ) => {
        // Icons are decorative by default; allow consumers to opt-in to an accessible name.
        const ariaHidden = ariaHiddenProp ?? (ariaLabel || ariaLabelledBy ? undefined : true);
        const itemUrl = typeof item === 'number' ? ITEM_URL_MAP[item] : undefined;

        return (
            <span
                ref={ref}
                className={classNames(styles.icon, name && styles[name], bounce && styles['icon-bounce'], className)}
                role={ariaHidden ? undefined : 'img'}
                aria-label={ariaLabel}
                aria-labelledby={ariaLabelledBy}
                aria-hidden={ariaHidden}
                style={{
                    width: size,
                    height: size,
                    ...(itemUrl ? { backgroundImage: `url(${itemUrl})` } : null),
                    ...style,
                }}
                {...rest}
            />
        );
    }
);

Icon.displayName = 'Icon';
