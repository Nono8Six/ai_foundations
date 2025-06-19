import React from 'react';
import {
  Activity, AlertCircle, AlertTriangle, ArrowDown, ArrowLeft, ArrowRight,
  ArrowUp, ArrowUpDown, Award, BarChart3, Bell, Bold, BookMarked, BookOpen,
  Bookmark, Brain, Calculator, Calendar, CalendarDays, Camera, Captions, Check,
  CheckCircle, CheckSquare, ChevronDown, ChevronLeft, ChevronRight, ChevronUp,
  Circle, Clock, Code, Cookie, Copy, CreditCard, Database, Download, Edit, Edit2,
  Edit3, Euro, Eye, EyeOff, Facebook, File, FileText, Filter, Flame, Folder,
  FolderOpen, GitBranch, GraduationCap, Grid3X3, HelpCircle, Highlighter, Home,
  Image, Info, Italic, Key, LayoutDashboard, Link, Linkedin, List, Loader,
  Loader2, Lock, LogIn, LogOut, Mail, MapPinOff, MapPin, Maximize, Menu,
  MessageCircle, MessageSquare, MoreHorizontal, MoreVertical, Palette, Pause,
  Phone, PieChart, Play, Plus, Quote, RefreshCw, Rocket, RotateCcw, RotateCw,
  Save, Search, Send, ServerOff, Settings, Share, Shield, ShoppingCart, Sparkles,
  Star, StickyNote, Target, Trash2, TrendingUp, Trophy, Twitter, Type, Upload,
  User, UserCheck, UserPlus, UserX, Users, Video, Volume2, X, XCircle, Youtube,
  Zap,
} from 'lucide-react';

const icons = {
  Activity,
  AlertCircle,
  AlertTriangle,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  ArrowUpDown,
  Award,
  BarChart3,
  Bell,
  Bold,
  BookMarked,
  BookOpen,
  Bookmark,
  Brain,
  Calculator,
  Calendar,
  CalendarDays,
  Camera,
  Captions,
  Check,
  CheckCircle,
  CheckSquare,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Circle,
  Clock,
  Code,
  Cookie,
  Copy,
  CreditCard,
  Database,
  Download,
  Edit,
  Edit2,
  Edit3,
  Euro,
  Eye,
  EyeOff,
  Facebook,
  File,
  FileText,
  Filter,
  Flame,
  Folder,
  FolderOpen,
  GitBranch,
  GraduationCap,
  Grid3X3,
  HelpCircle,
  Highlighter,
  Home,
  Image,
  Info,
  Italic,
  Key,
  LayoutDashboard,
  Link,
  Linkedin,
  List,
  Loader,
  Loader2,
  Lock,
  LogIn,
  LogOut,
  Mail,
  MapPinOff,
  MapPin,
  Maximize,
  Menu,
  MessageCircle,
  MessageSquare,
  MoreHorizontal,
  MoreVertical,
  Palette,
  Pause,
  Phone,
  PieChart,
  Play,
  Plus,
  Quote,
  RefreshCw,
  Rocket,
  RotateCcw,
  RotateCw,
  Save,
  Search,
  Send,
  ServerOff,
  Settings,
  Share,
  Shield,
  ShoppingCart,
  Sparkles,
  Star,
  StickyNote,
  Target,
  Trash2,
  TrendingUp,
  Trophy,
  Twitter,
  Type,
  Upload,
  User,
  UserCheck,
  UserPlus,
  UserX,
  Users,
  Video,
  Volume2,
  X,
  XCircle,
  Youtube,
  Zap,
};

function Icon({
  name,
  size = 24,
  color = 'currentColor',
  className = '',
  strokeWidth = 2,
  ...props
}) {
  const IconComponent = icons[name];

  if (!IconComponent) {
    return (
      <HelpCircle
        size={size}
        color='gray'
        strokeWidth={strokeWidth}
        className={className}
        {...props}
      />
    );
  }

  return (
    <IconComponent
      size={size}
      color={color}
      strokeWidth={strokeWidth}
      className={className}
      {...props}
    />
  );
}
export default Icon;
