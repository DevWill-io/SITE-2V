import {
  forwardRef,
  type ButtonHTMLAttributes,
  type ReactNode,
} from 'react';

type Variante = 'primary' | 'outline' | 'suap' | 'danger' | 'link' | 'ghost';
type Tamanho = 'sm' | 'md' | 'lg';

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variante?: Variante;
  tamanho?: Tamanho;
  carregando?: boolean;
  icone?: ReactNode;
  children?: ReactNode;
}

const CLASSE_VARIANTE: Record<Variante, string> = {
  primary: 'btn btn-primary',
  outline: 'btn btn-outline',
  suap: 'btn btn-outline btn-suap',
  danger: 'button is-danger',
  link: 'button is-link',
  ghost: 'btn-like',
};

const CLASSE_TAMANHO: Record<Tamanho, string> = {
  sm: 'btn-sm',
  md: '',
  lg: 'button is-large',
};

export const Button = forwardRef<HTMLButtonElement, Props>(
  function Button(
    {
      variante = 'primary',
      tamanho = 'md',
      carregando = false,
      icone,
      children,
      className = '',
      disabled,
      ...rest
    },
    ref
  ) {
    const classes = [
      CLASSE_VARIANTE[variante],
      CLASSE_TAMANHO[tamanho],
      className,
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <button
        ref={ref}
        className={classes}
        disabled={disabled || carregando}
        {...rest}
      >
        {carregando ? (
          <>
            <i className="fa-solid fa-spinner fa-spin" /> Carregando...
          </>
        ) : (
          <>
            {icone}
            {children}
          </>
        )}
      </button>
    );
  }
);