import React from 'react';
import { Link } from 'react-router-dom';
import Icon from '@shared/components/AppIcon';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    formation: [
      { name: 'Programmes', path: '/programmes' },
      { name: 'Fondamentaux IA', path: '/programmes' },
      { name: 'IA Comptabilité', path: '/programmes' },
      { name: 'IA Commerce', path: '/programmes' },
      { name: 'IA Finance', path: '/programmes' },
      { name: 'Maintenance Prédictive', path: '/programmes' },
    ],
    plateforme: [
      { name: 'Tableau de bord', path: '/user-dashboard' },
      { name: 'Mon profil', path: '/user-profile-management' },
      { name: 'Mes cours', path: '/lesson-viewer' },
      { name: 'Connexion', path: '/login' },
    ],
    entreprise: [
      { name: 'Solutions entreprise', path: '/programmes' },
      { name: 'Formation équipes', path: '/programmes' },
      { name: 'Consulting IA', path: '/programmes' },
      { name: 'Support technique', path: '/programmes' },
    ],
    legal: [
      { name: 'Mentions légales', path: '#' },
      { name: 'Politique de confidentialité', path: '#' },
      { name: "Conditions d'utilisation", path: '#' },
      { name: 'RGPD', path: '#' },
    ],
  };

  const socialLinks = [
    { name: 'LinkedIn', icon: 'Linkedin', url: '#' },
    { name: 'Twitter', icon: 'Twitter', url: '#' },
    { name: 'YouTube', icon: 'Youtube', url: '#' },
    { name: 'Facebook', icon: 'Facebook', url: '#' },
  ];

  return (
    <footer className='bg-secondary-900 text-white'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        {/* Main Footer Content */}
        <div className='py-16'>
          <div className='grid lg:grid-cols-6 gap-8'>
            {/* Brand Section */}
            <div className='lg:col-span-2'>
              <Link to='/' className='flex items-center space-x-3 mb-6'>
                <div className='w-12 h-12 bg-gradient-to-br from-primary to-primary-700 rounded-full flex items-center justify-center'>
                  <Icon aria-hidden='true' name='Brain' size={28} color='white' />
                </div>
                <span className='text-2xl font-bold'>AI Foundations</span>
              </Link>

              <p className='text-secondary-300 mb-6 leading-relaxed'>
                La plateforme de formation IA de référence pour les professionnels. Transformez
                votre carrière avec l&rsquo;intelligence artificielle.
              </p>

              {/* Contact Info */}
              <div className='space-y-3 mb-6'>
                <div className='flex items-center'>
                  <Icon aria-hidden='true' name='Mail' size={18} className='mr-3 text-primary' />
                  <span className='text-secondary-300'>contact@ai-foundations.fr</span>
                </div>
                <div className='flex items-center'>
                  <Icon aria-hidden='true' name='Phone' size={18} className='mr-3 text-primary' />
                  <span className='text-secondary-300'>+33 1 23 45 67 89</span>
                </div>
                <div className='flex items-center'>
                  <Icon aria-hidden='true' name='MapPin' size={18} className='mr-3 text-primary' />
                  <span className='text-secondary-300'>Paris, France</span>
                </div>
              </div>

              {/* Social Links */}
              <div className='flex space-x-4'>
                {socialLinks.map(social => (
                  <a
                    key={social.name}
                    href={social.url}
                    className='w-10 h-10 bg-secondary-800 rounded-lg flex items-center justify-center hover:bg-primary transition-colors duration-200'
                    aria-label={social.name}
                  >
                    <Icon aria-hidden='true' name={social.icon} size={18} />
                  </a>
                ))}
              </div>
            </div>

            {/* Formation Links */}
            <div>
              <h3 className='text-lg font-semibold mb-6'>Formation</h3>
              <ul className='space-y-3'>
                {footerLinks.formation.map(link => (
                  <li key={link.name}>
                    <Link
                      to={link.path}
                      className='text-secondary-300 hover:text-white transition-colors duration-200 flex items-center group'
                    >
                      <Icon
                        aria-hidden='true'
                        name='ChevronRight'
                        size={14}
                        className='mr-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200'
                      />
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Platform Links */}
            <div>
              <h3 className='text-lg font-semibold mb-6'>Plateforme</h3>
              <ul className='space-y-3'>
                {footerLinks.plateforme.map(link => (
                  <li key={link.name}>
                    <Link
                      to={link.path}
                      className='text-secondary-300 hover:text-white transition-colors duration-200 flex items-center group'
                    >
                      <Icon
                        aria-hidden='true'
                        name='ChevronRight'
                        size={14}
                        className='mr-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200'
                      />
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Enterprise Links */}
            <div>
              <h3 className='text-lg font-semibold mb-6'>Entreprise</h3>
              <ul className='space-y-3'>
                {footerLinks.entreprise.map(link => (
                  <li key={link.name}>
                    <Link
                      to={link.path}
                      className='text-secondary-300 hover:text-white transition-colors duration-200 flex items-center group'
                    >
                      <Icon
                        aria-hidden='true'
                        name='ChevronRight'
                        size={14}
                        className='mr-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200'
                      />
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal Links */}
            <div>
              <h3 className='text-lg font-semibold mb-6'>Légal</h3>
              <ul className='space-y-3'>
                {footerLinks.legal.map(link => (
                  <li key={link.name}>
                    <a
                      href={link.path}
                      className='text-secondary-300 hover:text-white transition-colors duration-200 flex items-center group'
                    >
                      <Icon
                        aria-hidden='true'
                        name='ChevronRight'
                        size={14}
                        className='mr-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200'
                      />
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Newsletter Section */}
        <div className='border-t border-secondary-800 py-8'>
          <div className='grid md:grid-cols-2 gap-8 items-center'>
            <div>
              <h3 className='text-xl font-semibold mb-2'>Restez informé</h3>
              <p className='text-secondary-300'>
                Recevez les dernières actualités sur l&rsquo;IA et nos nouveaux programmes
              </p>
            </div>
            <div className='flex flex-col sm:flex-row gap-3'>
              <input
                type='email'
                placeholder='Votre adresse email'
                className='flex-1 px-4 py-3 bg-secondary-800 border border-secondary-700 rounded-lg text-white placeholder-secondary-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent'
              />
              <button className='px-6 py-3 bg-primary text-white font-medium rounded-lg hover:bg-primary-700 transition-colors duration-200 flex items-center justify-center'>
                <Icon aria-hidden='true' name='Send' size={18} className='mr-2' />
                S&rsquo;abonner
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className='border-t border-secondary-800 py-6'>
          <div className='flex flex-col md:flex-row justify-between items-center'>
            <div className='text-secondary-400 text-sm mb-4 md:mb-0'>
              © {currentYear} AI Foundations. Tous droits réservés.
            </div>

            <div className='flex items-center space-x-6 text-sm text-secondary-400'>
              <div className='flex items-center'>
                <Icon aria-hidden='true' name='Shield' size={16} className='mr-2 text-success' />
                <span>Certifié RGPD</span>
              </div>
              <div className='flex items-center'>
                <Icon aria-hidden='true' name='Award' size={16} className='mr-2 text-warning' />
                <span>Qualité Qualiopi</span>
              </div>
              <div className='flex items-center'>
                <Icon aria-hidden='true' name='Lock' size={16} className='mr-2 text-primary' />
                <span>Sécurisé SSL</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
