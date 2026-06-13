import { Link } from 'react-router-dom';

const EmptyState = ({
  icon,
  title = 'Nothing here yet',
  message = 'There are no items to display at this time.',
  actionText,
  actionLink,
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-surface-container">
        {icon || <span className="material-symbols-outlined text-4xl text-on-surface-variant/70">inbox</span>}
      </div>

      <h3 className="mb-2 text-headline-sm font-semibold text-on-surface">
        {title}
      </h3>

      <p className="mb-6 max-w-md text-body-md text-on-surface-variant">
        {message}
      </p>

      {actionText && actionLink && (
        <Link 
          to={actionLink} 
          className="bg-gradient-to-r from-primary to-secondary text-white hover:brightness-110 px-8 py-3 rounded-xl font-semibold transition-all shadow-md active:scale-95 text-sm"
        >
          {actionText}
        </Link>
      )}
    </div>
  );
};

export default EmptyState;

