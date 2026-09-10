export default function Button({children,className='',variant='ghost',...p}){return <button className={`mf-btn mf-btn-${variant} ${className}`} {...p}>{children}</button>}
