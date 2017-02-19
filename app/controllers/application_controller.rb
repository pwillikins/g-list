class ApplicationController < ActionController::Base
  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use :null_session instead.
  protect_from_forgery with: :exception

  respond_to :json
  helper_method :current_user
  before_action :configure_permitted_parameters, if: :devise_controller?

  def angular
    render 'layouts/application'
  end

  def current_user
    if request.session['warden.user.user.key'][0][0].present?
      user_id = request.session['warden.user.user.key'][0][0]
      @current_user ||= User.find(user_id)
    end
  end

  private

  def configure_permitted_parameters
    devise_parameter_sanitizer.for(:sign_up) << :username
  end
end
