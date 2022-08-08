import logging

import ckanext.datesearch.helpers as helpers
import ckan.plugins as plugins
import ckan.plugins.toolkit as toolkit

log = logging.getLogger(__name__)


class DateSearchPlugin(plugins.SingletonPlugin):
    plugins.implements(plugins.IConfigurer)
    plugins.implements(plugins.ITemplateHelpers)
    plugins.implements(plugins.IPackageController, inherit=True)

    def update_config(self, config):
        toolkit.add_template_directory(config, 'templates')
        toolkit.add_resource('fanstatic', 'ckanext-datesearch')

    def before_search(self, search_params):
        """ This function adds the publication_date from the extras url parameters to the solr
                search parameters and returns control to CKAN Package Controller """
        extras = search_params.get('extras')
        if not extras:
            # There are no extras in the search params, so do nothing.
            return search_params
        start_date = extras.get('ext_pub_start')
        end_date = extras.get('ext_pub_end')
        if not start_date and not end_date:
            # The user didn't select either a start and/or end date, so do nothing.
            return search_params
        if not start_date:
            start_date = '*'
        if not end_date:
            end_date = '*'
        # Add a date-range query with the selected start and/or end dates into the Solr facet queries.
        fq = search_params.get('fq', '')
        fq = '{fq} +extras_publication_date:[{sd} TO {ed}]'.format(fq=fq, sd=start_date, ed=end_date)
        search_params['fq'] = fq
        return search_params

    # ITemplateHelpers

    def get_helpers(self):
        function_names = (
            'get_earliest_publication_year',
        )
        return _get_module_functions(helpers, function_names)


def _get_module_functions(module, function_names):
    """ Reformat helper function names for get_helpers() """
    functions = {}
    for f in function_names:
        functions[f] = module.__dict__[f]

    return functions
